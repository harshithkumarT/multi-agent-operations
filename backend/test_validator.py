from app.services.validator import validate_action

print("valid action:")
print(validate_action("Escalate"))

print("\n Invalid  action")
print(validate_action("close Ticket"))

print("\n Another valid action")
print(validate_action("Resolve"))
