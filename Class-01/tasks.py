"""
STUDENT TASKS — LLM API Calling with Python
============================================
Complete each task using what you learned in lessons 01–04.
Each task has a description, hints, and a starter template.

Run your solution:  python tasks.py
"""

import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8")
load_dotenv()

client = OpenAI(
    api_key=os.getenv("DO_API_KEY"),
    base_url=os.getenv("DO_BASE_URL"),
)
MODEL = os.getenv("MODEL")

# ===========================================================
# TASK 1 — Ask Anything
# ===========================================================
# Make one API call asking the model any question you want.
# Print the model's reply.
#
# Hint: See 01_basic_call.py

def task1():
    
    print("=== TASK 1: Ask Anything ===")
    
    print("enter your msg:")

    msg = input();

    if msg == "quit":
        return msg

    response = client.chat.completions.create(
        model = MODEL,
        messages=[
            {
                "role": "user",
                "content": msg,
            }
        ],
    )

    # print("Row response:", response, "\n\n---\n\n")  # raw response object

    # Response is nested — dig to get the text
    text = response.choices[0].message.content
    print("Model replied:", text)

    # # Always track token usage in production
    print("\nToken usage:", response.usage)

# ===========================================================
# TASK 2 — Q&A Bot (Loop)
# ===========================================================
# Build a simple loop:
#   1. Ask user to type a question (input())
#   2. Send it to the model
#   3. Print the answer
#   4. Repeat until user types "quit"
#
# Hint: use a while loop + 01_basic_call.py pattern

def task2():
    print("=== TASK 2: Q&A Bot ===")
    print("Type 'quit' to exit.\n")

    value = True

    while value:
        print("enter your msg:")

        msg = input();

        if msg == "quit":
            return

        response = client.chat.completions.create(
            model = MODEL,
            messages=[
                {
                    "role": "user",
                    "content": msg,
                }
            ],
        )

        # Response is nested — dig to get the text
        text = response.choices[0].message.content
        print("Model replied:", text)

    # Always track token usage in production
    print("\nToken usage:", response.usage)

        
    # YOUR CODE HERE

# ===========================================================
# TASK 3 — Chatbot with Memory
# ===========================================================
# Same as Task 2 BUT the bot remembers the full conversation.
# Test it: tell it your name, then later ask "what is my name?"
#
# Hint: See 03_chat_history.py — maintain a history list

def chat(history: list, user_message: str) -> str:
    
    if str == "quit":
        return str

    history.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model=MODEL,
        messages=history,  # send FULL history every call
    )

    assistant_message = response.choices[0].message

    # Push assistant reply so next turn remembers it
    history.append({"role": "assistant", "content": assistant_message.content})

    return assistant_message.content

def task3():
    print("=== TASK 3: Chatbot with Memory ===")
    print("Type 'quit' to exit.\n")
    history = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    print("turn 1", chat(history,input()))

    print("turn 2",chat(history,input()))

    print("turn 3",chat(history,input()))

    import json
    print("\nFull history sent on last call:")
    print(json.dumps(history, indent=2))

# ===========================================================
# TASK 4 — Streaming Chatbot
# ===========================================================
# Same as Task 3 BUT stream the response token-by-token
# so it feels faster to the user.
#
# Hint: See 02_streaming.py — stream=True + for chunk in stream

def chatStreaming(history: list, user_message: str) -> str:
   
    if user_message == "quit":
        return user_message

    history.append({"role": "user", "content": user_message})

    stream = client.chat.completions.create(
        model=MODEL,
        messages=history,  # send FULL history every call
        stream = True
    )

    assistant_message = ""

    for chunk in stream:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta.content or ""
        assistant_message +=delta
        print(delta, end="", flush=True)  # print each token as it arrives


    # Push assistant reply so next turn remembers it
    history.append({"role": "assistant", "content":assistant_message})

    return assistant_message


def task4():
    print("=== TASK 4: Streaming Chatbot ===")
    print("Type 'quit' to exit.\n")
    history = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    print("turn 1:\n")

    chatStreaming(history,input())

    print("\nturn 2:\n")

    chatStreaming(history,input())

    print("\nturn 3:\n")

    chatStreaming(history,input())

    print("\n\n[stream ended]")

    # print(history)

    import json
    print("\nFull history sent on last call:")
    print(json.dumps(history, indent=2))

# ===========================================================
# TASK 5 — Persona Bot
# ===========================================================
# Create a chatbot with a custom persona using a system prompt.
# Ideas: a chef, a doctor, a Shakespearean actor, a rapper.
# User talks to it in a loop.
#
# Hint: Set "role": "system" with a creative persona description.
#       See 04_parameters.py pirate example.

def task5():
    print("=== TASK 5: Persona Bot ===")
    persona = "You are a rapper talks only in family-freindly rap"  # change this!
    history = [{"role": "system", "content": persona}]
    print(f"Persona: {persona}\nType 'quit' to exit.\n")

    prompt = ""

    while True:
        print("Enter your message: (type 'quit' to exit chat)")
        prompt = input()

        if prompt == "quit":
            return
        pirate = client.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=[
                {"role": "system", "content": persona},
                {"role": "user", "content": prompt},
            ],
        )
        print(pirate.choices[0].message.content)


# ===========================================================
# TASK 6 — Language Translator
# ===========================================================
# Ask the user to type any English sentence.
# Translate it to Urdu using the model.
# Print the translation.
# Bonus: let the user pick the target language.
#
# Hint: Use system prompt to set translator role.

def task6():
    print("=== TASK 6: Language Translator ===")
    persona = "You are a language translator, your job is to answer the query user into the language the user wants, usually the target language at the end of the sentence ie '-Urdu' etc. \n If there is not language, point that out to the user."  # change this!
    history = [{"role": "system", "content": persona}]
    prompt = ""
    language = ""

    while True: 
        print("Enter your prompt: ")
        prompt = input()
        
        if prompt == "quit":
            return 

        print("Enter your target language: ")
        language = input()

        print(f"Persona: {persona}\nType 'quit' to exit.\n")

        pirate = client.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=[
                {"role": "system", "content": persona},
                {"role": "user", "content": f"{prompt} -{language}"},
            ],
        )
        print(pirate.choices[0].message.content)


# ===========================================================
# TASK 7 — Temperature Experiment
# ===========================================================
# Send the SAME prompt to the model 3 times with different temperatures:
#   0.0, 0.7, 1.5
# Print all 3 responses and compare them.
# Notice: low temp = consistent, high temp = creative/random.
#
# Hint: See 04_parameters.py temperature section.

def task7():
    print("=== TASK 7: Temperature Experiment ===")
    prompt = "Write a one-sentence motivational quote."
    temperatures = [0.0, 0.7, 1.5]

    for i in range(0,3):
        print(f"=== temperature: {temperatures[i]} (focused) ===")
        cold = client.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=[{"role": "user", "content": prompt}],
            temperature=temperatures[i],
        )
        print(cold.choices[0].message.content)

# ===========================================================
# TASK 8 — Token Counter
# ===========================================================
# Ask the model 3 different questions (short, medium, long prompt).
# After each call, print how many tokens were used.
# Observe: longer prompts = more prompt_tokens consumed.
#
# Hint: response.usage.prompt_tokens, response.usage.completion_tokens

def task8():
    print("=== TASK 8: Token Counter ===")
    questions = [
        "Hi.",
        "Explain what Python is in 2 sentences.",
        "Write a detailed explanation of how the internet works, including DNS, TCP/IP, HTTP, and servers.",
    ]

    for i in range(0,3):
        response = client.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=[{"role":"user","content":questions[i]}]
        )
        print(f"prompt one: {questions[i]}",response.usage.prompt_tokens)
        print(f"prompt one: {questions[i]}",response.usage.completion_tokens)

# ===========================================================
# Run one task at a time — comment/uncomment as needed
# ===========================================================

if __name__ == "__main__":
    # task1()
    # task2()
    # task3()
    # task4()
    # task5()
    # task6()
    # task7()
    # task8()
