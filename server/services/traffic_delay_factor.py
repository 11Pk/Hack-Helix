import random
def get_traffic_factor(level):
    if level == "high":
        return round(random.uniform(1.6, 2.0), 2)
    elif level == "medium":
        return round(random.uniform(1.2, 1.5), 2)
    else:
        return round(random.uniform(1.0, 1.2), 2)