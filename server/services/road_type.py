import random
def get_road_type(area):
    if area == "office":
        return random.choice(["highway", "city"])
    elif area == "residential":
        return random.choice(["city", "local"])
    else:
        return random.choice(["city", "local", "highway"])
    

def get_road_factor(road_type):
    if road_type == "highway":
        return round(random.uniform(1.0, 1.2), 2)
    elif road_type == "city":
        return round(random.uniform(1.2, 1.5), 2)
    else:
        return round(random.uniform(1.5, 2.0), 2)