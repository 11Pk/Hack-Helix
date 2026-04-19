def get_traffic_level(time, weather, area):
    score = 0

    if time in ["morning", "evening"]:
        score += 2
    elif time == "afternoon":
        score += 1

    if weather == "rain":
        score += 2
    elif weather == "fog":
        score += 1

    if area == "office" and time in ["morning", "evening"]:
        score += 2
    elif area == "residential" and time == "evening":
        score += 1

    if score >= 4:
        return "high"
    elif score >= 2:
        return "medium"
    else:
        return "low"