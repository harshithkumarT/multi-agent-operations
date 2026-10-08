from app.services.validator import validate_action


def test_valid_resolve_action():
    result = validate_action("Resolve")

    assert result == "Resolve"


def test_valid_escalate_action():
    result = validate_action("Escalate")

    assert result == "Escalate"


def test_valid_keep_pending_action():
    result = validate_action("Keep Pending")

    assert result == "Keep Pending"


def test_invalid_action_defaults_to_escalate():
    result = validate_action("Something Wrong")

    assert result == "Escalate"


def test_action_with_spaces():
    result = validate_action("  Resolve  ")

    assert result == "Resolve"