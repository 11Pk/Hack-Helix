import random
def customer_behavior(area, time):
    if area == "office":
        home_prob = 0.2 if time in ["morning","afternoon"] else 0.7
    elif area == "residential":
        home_prob = 0.7 if time in ["evening","night"] else 0.4
    else:
        home_prob = 0.5

    failure_rate = round(1 - home_prob + random.uniform(-0.1,0.1),2)
    return max(0, min(1, failure_rate)), home_prob