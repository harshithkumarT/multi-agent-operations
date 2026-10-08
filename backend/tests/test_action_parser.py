from app.services.action_parser import extract_recommended_action


def test_extract_resolve_action():
    response = """
    Response:
    Your issue has been resolved.

    Recommended Action: Resolve

    Reason:
    The issue was fixed successfully.
    """

    result = extract_recommended_action(response)

    assert result == "Resolve"


def test_extract_escalate_action():
    response = """
    Response:
    This issue requires human assistance.

    Recommended Action: Escalate

    Reason:
    The agent could not resolve the issue.
    """

    result = extract_recommended_action(response)

    assert result == "Escalate"


def test_extract_keep_pending_action():
    response = """
    Response:
    We need more information from the customer.

    Recommended Action: Keep Pending

    Reason:
    Waiting for additional details.
    """

    result = extract_recommended_action(response)

    assert result == "Keep Pending"


def test_extract_action_with_spaces():
    response = """
    Response:
    Issue handled.

    Recommended Action:    Resolve

    Reason:
    Problem fixed.
    """

    result = extract_recommended_action(response)

    assert result == "Resolve"


def test_missing_recommended_action():
    response = """
    Response:
    The customer issue was reviewed.

    Reason:
    More investigation is required.
    """

    result = extract_recommended_action(response)

    assert result is None