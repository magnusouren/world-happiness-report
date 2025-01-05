import pandas as pd
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.offsetbox import OffsetImage, AnnotationBbox

# Load the dataset
data_path = '../new_data.csv'  # Replace with your actual file path
data = pd.read_csv(data_path)

# Group by country and calculate the mean for normalized values
columns_to_average = [
    "gpdPerCapita_z", "socialSupport_z", "healthyLifeExpectancyAtBirth_z",
    "freedomToMakeLifeChoices_z", "generosity_z", "corruption_z"
]
grouped_data = data.groupby("countryName")[
    columns_to_average].mean().reset_index()

# Add continent information
grouped_data = grouped_data.merge(
    data[['countryName', 'continent']].drop_duplicates(), on='countryName')

# Apply PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform(grouped_data[columns_to_average])

# Add PCA results to the dataframe
grouped_data["PCA1"] = pca_result[:, 0]
grouped_data["PCA2"] = pca_result[:, 1]

# Print explained variance
print("Explained variance ratio:", pca.explained_variance_ratio_)

# Scatter plot of PCA results
fig, ax = plt.subplots(figsize=(12, 8))
scatter = sns.scatterplot(
    x="PCA1", y="PCA2", hue="continent", data=grouped_data, palette="Set2", s=100, alpha=0.8, ax=ax
)
plt.title("PCA Scatter Plot of Countries by Continent")
plt.xlabel("PCA1")
plt.ylabel("PCA2")
plt.legend(title="Continent")
plt.grid(True)

# Add hover effect
annot = ax.annotate(
    "",
    xy=(0, 0),
    xytext=(10, 10),
    textcoords="offset points",
    bbox=dict(boxstyle="round", fc="w"),
    arrowprops=dict(arrowstyle="->")
)
annot.set_visible(False)


def update_annot(ind):
    pos = scatter.collections[0].get_offsets()[ind]
    annot.xy = pos
    text = grouped_data.iloc[ind]["countryName"]
    annot.set_text(text)
    annot.get_bbox_patch().set_alpha(0.8)


def hover(event):
    vis = annot.get_visible()
    if event.inaxes == ax:
        cont, ind = scatter.collections[0].contains(event)
        if cont:
            # Use the first index from the detected points
            update_annot(ind["ind"][0])
            annot.set_visible(True)
            fig.canvas.draw_idle()
        elif vis:
            annot.set_visible(False)
            fig.canvas.draw_idle()


fig.canvas.mpl_connect("motion_notify_event", hover)

plt.show()
