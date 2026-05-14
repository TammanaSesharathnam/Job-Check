from app import app
rules = sorted([str(r) for r in app.url_map.iter_rules()])
with open("routes.txt", "w") as f:
    f.write("\n".join(rules))
print("Done - written to routes.txt")
