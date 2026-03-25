#!/usr/bin/env python3
import json
import subprocess
import sys
from datetime import datetime

ALLOW = {
    "+6285770011081",  # Jessie
    "+6285860439931",  # Leevania
}


def run(cmd: list[str]) -> str:
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stdout.strip())
    return p.stdout


def pick_sender(req: dict):
    # try common fields
    for k in ("sender", "from", "phone", "e164", "number", "whatsapp_e164", "id"):
        v = req.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    # nested forms
    for k in ("user", "contact"):
        obj = req.get(k)
        if isinstance(obj, dict):
            for kk in ("e164", "phone", "number"):
                v = obj.get(kk)
                if isinstance(v, str) and v.strip():
                    return v.strip()
    return None


def pick_code(req: dict):
    for k in ("code", "pairingCode", "pairing_code"):
        v = req.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return None


def main():
    out = run(["openclaw", "pairing", "list", "whatsapp", "--json"])
    data = json.loads(out)
    reqs = data.get("requests") or []
    approved = []
    skipped = []

    for r in reqs:
        if not isinstance(r, dict):
            continue
        sender = pick_sender(r)
        code = pick_code(r)
        if not sender or not code:
            skipped.append({"sender": sender, "code": code, "raw": r})
            continue
        if sender not in ALLOW:
            skipped.append({"sender": sender, "code": code})
            continue

        # approve
        run(["openclaw", "pairing", "approve", "whatsapp", code])
        approved.append({"sender": sender, "code": code})

    ts = datetime.now().isoformat(timespec="seconds")
    print(json.dumps({"ts": ts, "approved": approved, "skipped": skipped, "pending": len(reqs)}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False))
        sys.exit(1)
