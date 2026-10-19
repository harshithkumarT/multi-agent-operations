from app.services.action_parser import extract_recommended_action


ai_response = """
Response:
I apologize for the confusion.

Recommended Action:
Escalate

Reason:
The issue needs further investigation.
"""


action = extract_recommended_action(ai_response)

print("Extracted action:")
print(action)
print(extract_recommended_action(
    "Response: Test\nRecommended Action: Keep Pending\nReason: Test"
))

print(extract_recommended_action(
    "Response: Test\nRecommended Action:\nKeep Pending\nReason: Test"
))