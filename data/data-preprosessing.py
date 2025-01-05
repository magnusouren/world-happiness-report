import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Load dataset
data_path = 'data.csv'
happiness_data = pd.read_csv(data_path, encoding='ISO-8859-1')

# Inspect dataset
print("Initial Data Overview:\n", happiness_data.head())

# Handle missing values
# Handle missing values only for numeric columns
numeric_columns = happiness_data.select_dtypes(include='number').columns
happiness_data[numeric_columns] = happiness_data[numeric_columns].fillna(
    happiness_data[numeric_columns].mean())

print("Missing values handled for numeric columns.")

# Print year intervals for each country
year_intervals = happiness_data.groupby(
    "Country name")["year"].agg(["min", "max"])

# Sort by the smallest interval
year_intervals = year_intervals.sort_values(by="min")

continent_map = {
    "Africa": ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Chad", "Comoros",
               "Congo (Brazzaville)", "Congo (Kinshasa)", "Djibouti", "Egypt", "Equatorial Guinea", "Eswatini", "Ethiopia",
               "Gabon", "Gambia", "Ghana", "Guinea", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
               "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria",
               "Rwanda", "Senegal", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
               "Tunisia", "Uganda", "Zambia", "Zimbabwe"],
    "Asia": ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus",
             "Georgia", "Hong Kong S.A.R. of China", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan",
             "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "Oman", "Pakistan",
             "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "State of Palestine", "Syria",
             "Taiwan Province of China", "Tajikistan", "Thailand", "Turkmenistan", "Türkiye", "Tï¿½rkiye", "United Arab Emirates", "Uzbekistan",
             "Vietnam", "Yemen"],
    "Europe": ["Albania", "Malta", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czechia", "Denmark",
               "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia",
               "Lithuania", "Luxembourg", "Moldova", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal",
               "Romania", "Russia", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom"],
    "North America": ["Bahamas", "Barbados", "Belize", "Canada", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador",
                      "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Saint Kitts and Nevis",
                      "Saint Lucia", "Saint Vincent and the Grenadines", "Trinidad and Tobago", "United States"],
    "South America": ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname",
                      "Uruguay", "Venezuela"],
    "Oceania": ["Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea",
                "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"]
}

# Function to map country to continent


def map_continent(country):
    for continent, countries in continent_map.items():
        if country in countries:
            return continent
    return "Unknown"


# Apply continent mapping
happiness_data["continent"] = happiness_data["Country name"].apply(
    map_continent)

# Normalize data for PCA
columns_to_normalize = [
    "Log GDP per capita",
    "Social support",
    "Healthy life expectancy at birth",
    "Freedom to make life choices",
    "Generosity",
    "Perceptions of corruption"
]
scaler = StandardScaler()
normalized_values = scaler.fit_transform(happiness_data[columns_to_normalize])
normalized_df = pd.DataFrame(normalized_values, columns=[f"{col.replace(' ', '').replace('Log', 'log').replace('Healthy', 'healthy').replace('Freedom', 'freedom').replace('Social', 'social').replace('Choices', 'choices').replace('Life', 'life').replace('GDP', 'gdp').replace(
    'Generosity', 'generosity').replace('Perceptions', 'perceptions').replace('Corruption', 'corruption').replace('AtBirth', 'atBirth').replace('ToMake', 'toMake').replace('LifeExpectancy', 'lifeExpectancy').lower()}Normalized" for col in columns_to_normalize])
happiness_data = pd.concat([happiness_data, normalized_df], axis=1)

# Rename all columns to camelCase
happiness_data.columns = [
    ''.join(word.title() if i > 0 else word for i, word in enumerate(
        col.replace(' ', '_').lower().split('_')))
    for col in happiness_data.columns
]

# Apply PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform(normalized_values)
happiness_data['pca1'] = pca_result[:, 0]
happiness_data['pca2'] = pca_result[:, 1]
print("PCA completed. Explained variance:", pca.explained_variance_ratio_)

# Prepare data for visualizations
average_happiness = happiness_data.groupby(
    'year')["lifeLadder"].mean().reset_index()
average_happiness.rename(
    columns={"lifeLadder": "averageHappiness"}, inplace=True)

# Write to a CSV file
year_intervals.to_csv("year_intervals.csv")

# Filter rows based on the largest minimum year across countries
max_min_year = 2013
happiness_data = happiness_data[happiness_data["year"] >= max_min_year]
print(f"Filtered data to include only years >= {max_min_year}.")

# Save cleaned and prepared data
prepared_data_path = 'happiness_data_prepared.csv'
happiness_data.to_csv(prepared_data_path, index=False)
print(f"Prepared data saved to {prepared_data_path}")

# Load your prepared dataset
data = pd.read_csv("happiness_data_prepared.csv")
# Save as JSON
data.to_json("data.json", orient="records")
print("Data saved as JSON.")

# Script completed
print("Data preparation complete.")
