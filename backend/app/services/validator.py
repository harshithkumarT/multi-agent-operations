ALLOWED_ACTIONS ={
    "Resolve",
    "Escalate",
    "Keep Pending"
}

def validate_action(action:str) -> str:
    action= action.strip()
    if action not in ALLOWED_ACTIONS:
        return "Escalate"

    return action
