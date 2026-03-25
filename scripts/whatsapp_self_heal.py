#!/usr/bin/env python3
import json
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

STATE_PATH = Path("/Users/phil/.openclaw/workspace/memory/wa_selfheal_state.json")


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def run(cmd, timeout=60):
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=timeout)
    return p.returncode, p.stdout


def load_state():
    if STATE_PATH.exists():
        try:
            return json.loads(STATE_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_state(s):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(s, ensure_ascii=False, indent=2), encoding="utf-8")


def parse_status():
    # Use channel-level status; it's the most reliable for WhatsApp running/connected
    rc, out = run(["openclaw", "channels", "status", "--json", "--probe", "--timeout", "8000"], timeout=90)
    if rc != 0:
        return {"error": f"openclaw status failed rc={rc}: {out.strip()[:500]}"}
    try:
        data = json.loads(out)
    except Exception as e:
        return {"error": f"invalid JSON from openclaw status: {e}; sample={out.strip()[:200]}"}

    # channels.whatsapp contains connected/running + lastError
    wa = None
    try:
        wa = (data.get("channels") or {}).get("whatsapp")
    except Exception:
        wa = None

    if not wa:
        return {"ok": True, "whatsapp": None, "note": "no whatsapp channel in channels status"}

    return {
        "ok": True,
        "whatsapp": {
            "configured": wa.get("configured"),
            "linked": wa.get("linked"),
            "running": wa.get("running"),
            "connected": wa.get("connected"),
            "lastDisconnect": wa.get("lastDisconnect"),
            "lastError": wa.get("lastError"),
            "authAgeMs": wa.get("authAgeMs"),
            "reconnectAttempts": wa.get("reconnectAttempts"),
        },
    }


def main():
    state = load_state()
    start_check = now_iso()

    st = parse_status()
    if st.get("error"):
        print(json.dumps({"ts": start_check, "ok": False, "action": "none", "error": st["error"]}, ensure_ascii=False))
        return 1

    wa = st.get("whatsapp")
    if not wa:
        print(json.dumps({"ts": start_check, "ok": True, "action": "none", "note": "whatsapp not configured"}, ensure_ascii=False))
        return 0

    connected = bool(wa.get("connected"))
    running = bool(wa.get("running"))

    if connected and running:
        # if we had a prior outage recorded, mark recovered and request notification
        outage = state.get("outage")
        notify = None
        if outage and outage.get("openAt") and not outage.get("closedAt"):
            outage["closedAt"] = start_check
            state["outage"] = outage
            save_state(state)
            notify = {
                "kind": "recovered",
                "openAt": outage.get("openAt"),
                "closedAt": outage.get("closedAt"),
                "reason": outage.get("reason"),
            }
        print(json.dumps({"ts": start_check, "ok": True, "action": "none", "whatsapp": wa, "notify": notify}, ensure_ascii=False))
        return 0

    # record outage start if not already
    outage = state.get("outage") or {}
    first_detect = False
    if not outage.get("openAt") or outage.get("closedAt"):
        outage = {"openAt": start_check, "closedAt": None, "reason": wa.get("lastError") or wa.get("lastDisconnect")}
        state["outage"] = outage
        save_state(state)
        first_detect = True

    # attempt restart gateway
    rc, out = run(["openclaw", "gateway", "restart"], timeout=120)
    action = {"kind": "restart_gateway", "rc": rc, "output": out.strip()[:500]}

    recovered = False
    last_wa = wa
    # wait/poll up to 60s
    for _ in range(12):
        time.sleep(5)
        st2 = parse_status()
        if st2.get("error"):
            continue
        wa2 = st2.get("whatsapp")
        last_wa = wa2 or last_wa
        if wa2 and wa2.get("connected") and wa2.get("running"):
            recovered = True
            break

    # if recovered, mark outage closed (but notification will be sent by cron runner)
    notify = None
    if recovered:
        outage["closedAt"] = now_iso()
        state["outage"] = outage
        save_state(state)
        notify = {
            "kind": "auto_recovered",
            "openAt": outage.get("openAt"),
            "closedAt": outage.get("closedAt"),
            "reason": outage.get("reason"),
            "action": action,
        }

    # notify on first detect even if auto-recover fails (so human knows we're degraded)
    if first_detect and not notify:
        notify = {
            "kind": "outage_detected",
            "openAt": outage.get("openAt"),
            "reason": outage.get("reason"),
        }

    print(json.dumps({
        "ts": now_iso(),
        "ok": True,
        "action": action,
        "recovered": recovered,
        "whatsapp": last_wa,
        "notify": notify,
    }, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
