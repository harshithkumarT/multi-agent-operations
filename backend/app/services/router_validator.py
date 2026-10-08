ALLOWED_ROUTES = {
    "Billing",
    "Support",
    "Order"
}

def validate_route(route:str) -> str:
    route=route.strip()
    if route not in ALLOWED_ROUTES:
        return "Support"
    return route