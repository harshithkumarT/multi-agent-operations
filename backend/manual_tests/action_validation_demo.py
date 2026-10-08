from app.services.action_parser import extract_recommended_action
from app.services.validator import validate_action


ai_response = """
Response:
I apologize for the confusion.

Recommended Action:
Escalate

Reason:
The issue needs further investigation.
"""


action = extract_recommended_action(ai_response)

validated_action = validate_action(action)

print("Extracted action:")
print(action)

print("\nValidated action:")
print(validated_action)