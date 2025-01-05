import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# Load dataset
data_path = 'data_new_titles.csv'
happiness_data = pd.read_csv(data_path, encoding='ISO-8859-1')

# Inspect dataset
print("Initial Data Overview:\n", happiness_data.head())

# Handle missing values
# Handle missing values only for numeric columns
numeric_columns = happiness_data.select_dtypes(include='number').columns
happiness_data[numeric_columns] = happiness_data[numeric_columns].fillna(
    happiness_data[numeric_columns].mean()
)
print("Missing values handled for numeric columns.")

# Print year intervals for each country
year_intervals = happiness_data.groupby(
    "countryName")["year"].agg(["min", "max"])

# Sort by the smallest interval
year_intervals = year_intervals.sort_values(by="min")

# Continent mapping
continent_map = {
    "Africa": ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Chad", "Comoros",
               "Congo (Brazzaville)", "Congo (Kinshasa)", "Djibouti", "Egypt", "Equatorial Guinea", "Eswatini", "Ethiopia",
               "Gabon", "Gambia", "Ghana", "Guinea", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
               "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria",
               "Rwanda", "Senegal", "Sierra Leone", "Somalia", "Somaliland region", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
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


def map_continent(country):
    for continent, countries in continent_map.items():
        if country in countries:
            return continent
    return "Unknown"


# Apply continent mapping
happiness_data["continent"] = happiness_data["countryName"].apply(
    map_continent)

print("Continent mapping applied.")

# Normalize data with Z-score
columns_to_normalize = [
    "gpdPerCapita",
    "socialSupport",
    "healthyLifeExpectancyAtBirth",
    "freedomToMakeLifeChoices",
    "generosity",
    "corruption"
]

scaler = StandardScaler()
z_normalized_values = scaler.fit_transform(
    happiness_data[columns_to_normalize])

# Add normalized columns to the dataset
normalized_df = pd.DataFrame(z_normalized_values, columns=[
                             f"{col}_z" for col in columns_to_normalize])
happiness_data = pd.concat([happiness_data, normalized_df], axis=1)

print("Data normalized with Z-score.")

# PCA on the normalized data
pca = PCA(n_components=2)

# Define the columns for PCA
columns_for_pca = [
    "gpdPerCapita_z",
    "socialSupport_z",
    "healthyLifeExpectancyAtBirth_z",
    "freedomToMakeLifeChoices_z",
    "generosity_z",
    "corruption_z"
]
# Apply PCA
pca_result = pca.fit_transform(happiness_data[columns_for_pca])

# Add PCA results to the dataset
happiness_data['pca1'] = pca_result[:, 0]
happiness_data['pca2'] = pca_result[:, 1]

print("PCA applied on the normalized data.")

# Save cleaned and prepared data
prepared_data_path = 'new_data.csv'
happiness_data.to_csv(prepared_data_path, index=False)
print(f"Prepared data with normalized values saved to {prepared_data_path}")
