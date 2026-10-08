def extract_recommended_action(response: str) -> str | None:
    marker = "Recommended Action:"

    if marker not in response:
        return None

    action = response.split(marker, 1)[1].splitlines()[0].strip()

    if not action:
        return None

    return action