# Race Conditions

Platform: TryHackMe
Difficulty: medium
OS: N/A
Category: Web
Tags: Race Condition, Concurrency, Web
Date: 2026-06-25

# About Race Conditions

Race condition occurs when multiple threads execute simultaneously. The output is unpredictable as it will depend on the program itself.

### Example of Race Condition

I use this Python example to examine how the threads execute:

```python
import threading
import time

# Shared counter variable
counter = 0

# Number of increments each thread will perform
increments = 100000

def increment_counter():
    global counter
    for _ in range(increments):
        temp = counter
        # Introduce a tiny delay to increase the chance of a context switch
        time.sleep(0.000001)
        temp += 1
        counter = temp

# Creating two threads
thread1 = threading.Thread(target=increment_counter)
thread2 = threading.Thread(target=increment_counter)

# Starting the threads
thread1.start()
thread2.start()

# Waiting for both threads to complete
thread1.join()
thread2.join()

# Printing the final value of the counter
print(f"Final counter value: {counter}")
```

Both threads are executed together, and the output on whether which thread would finish first is unknown. Which would result that the expected result from the client side is different.

### Scenario 1 | Sending Request in Sequence

When executing race condition in sequence, the requests are sent one after the another. In a simple logic, it’s like I'm just spamming the button to send. If I only have $30 and I'm sending $10 to someone, when sending 10 request 3 out of 10 will only be successful since the requests are not running simultaneously but as an individual.

### Scenario 2 | Sending Request in Parallel

This is the very likely scenario that should be used by pentesters. As the requests are sent together, it will reach the destination at the same time.

![image.png](image.png)

In the captured parallel requests below, I see several successful responses with a frame length of 68.
