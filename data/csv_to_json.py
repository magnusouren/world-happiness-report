import csv
import json


def csv_to_json(csv_file_path, json_file_path):
    data = []

    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            for key in row:
                if row[key].isdigit():
                    row[key] = int(row[key])
                else:
                    try:
                        row[key] = float(row[key])
                    except ValueError:
                        pass
            data.append(row)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)


csv_to_json('./preprocessed_data.csv', './data.json')
