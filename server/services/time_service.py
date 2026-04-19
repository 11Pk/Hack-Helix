def get_time_of_day(time_str):

    hour = int(time_str.split(":")[0])

    if 6 <= hour < 12:
        return "Morning"

    elif 12 <= hour < 17:
        return "Afternoon"

    elif 17 <= hour < 21:
        return "Evening"

    return "Night"