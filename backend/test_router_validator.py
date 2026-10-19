from app.services.router_validator import validate_route


print("Valid route:")
print(validate_route("Billing"))

print("\nAnother valid route:")
print(validate_route("Order"))

print("\nInvalid route:")
print(validate_route("Finance"))