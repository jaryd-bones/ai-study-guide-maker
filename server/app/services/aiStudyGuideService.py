import json
from typing import Any, Dict, List, Optional
from openai import OpenAI
from app.core.config import getSettings

settings = getSettings()
client = OpenAI(api_key=settings.openaiApiKey)

def _logRawTextLength(rawText: str) -> None:
  rawLength = len(rawText or "")
  print(f"[generateStudyGuideFromText] rawText length: {rawLength} chars")

def _buildSystemMessage() -> str:
  return (
    "You are an assistant that turns raw study material into a structured study guide. "
    "Respond ONLY with valid JSON containing: "
    "'title', 'description', and 'flashcards'. "
    "Each flashcard must contain 'front_text' and 'back_text'. "
    "If a user provides a title or description, use it. Otherwise, generate them."
  )

def _buildUserPrompt(
  rawText: str,
  title: Optional[str],
  description: Optional[str],
) -> str:
  userParts: List[str] = []

  if title:
    userParts.append(f"Use this exact title: {title}")

  if description:
    userParts.append(f"Use this exact description: {description}")

  userParts.append("Raw study text begins below:")
  userParts.append(rawText)

  return "\n\n".join(userParts)


def _requestStudyGuideFromModel(systemMessage: str, promptText: str) -> str:
  try:
    completion = client.chat.completions.create(
      model="gpt-4o-mini",
      response_format={"type": "json_object"},
      messages=[
        {"role": "system", "content": systemMessage},
        {"role": "user", "content": promptText},
      ],
    )
  except Exception:
    import traceback
    print("[generateStudyGuideFromText] OpenAI API call failed:")
    traceback.print_exc()
    raise

  return completion.choices[0].message.content


def _cleanFlashcards(rawCards: Any) -> list[dict]:
  if not isinstance(rawCards, list):
    return []

  cleanedCards: list[dict] = []

  for fc in rawCards:
    if (
      isinstance(fc, dict)
      and "front_text" in fc
      and "back_text" in fc
    ):
      cleanedCards.append(
        {
          "front_text": fc["front_text"],
          "back_text": fc["back_text"],
        }
      )

  return cleanedCards


def _parseAndNormalizeStudyGuide(
  content: str,
  title: Optional[str],
  description: Optional[str],
) -> Dict[str, Any]:
  try:
    data = json.loads(content)
  except json.JSONDecodeError:
    import traceback
    print("[generateStudyGuideFromText] Failed to parse JSON from model:")
    print("Raw content from model:", repr(content[:500]), "...")
    traceback.print_exc()
    raise

  if not isinstance(data, dict):
    data = {}

  data.setdefault("title", title or "Untitled Study Guide")
  data.setdefault("description", description or "")
  data.setdefault("flashcards", [])

  data["flashcards"] = _cleanFlashcards(data["flashcards"])

  return data

def generateStudyGuideFromText(
  rawText: str,
  title: Optional[str] = None,
  description: Optional[str] = None,
) -> Dict[str, Any]:
  _logRawTextLength(rawText)

  systemMessage = _buildSystemMessage()
  promptText = _buildUserPrompt(rawText, title, description)

  content = _requestStudyGuideFromModel(systemMessage, promptText)

  data = _parseAndNormalizeStudyGuide(content, title, description)

  return data
