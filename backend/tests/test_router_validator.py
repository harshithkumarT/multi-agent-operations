from app.services.router_validator import validate_route


def test_valid_billing_route():
    result = validate_route("Billing")

    assert result == "Billing"


def test_valid_support_route():
    result = validate_route("Support")

    assert result == "Support"


def test_valid_order_route():
    result = validate_route("Order")

    assert result == "Order"


def test_invalid_route_defaults_to_support():
    result = validate_route("Something Wrong")

    assert result == "Support"


def test_route_with_spaces():
    result = validate_route("  Billing  ")

    assert result == "Billing"