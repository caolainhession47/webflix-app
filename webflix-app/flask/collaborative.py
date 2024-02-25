import pandas as pd
import requests
from sklearn.metrics.pairwise import cosine_similarity

# Function to fetch user movie IDs from the backend
def fetch_user_movie_ids(emails):
    node_backend_url = 'http://localhost:5000'
    all_movie_ids = set()

    for email in emails:
        favorites_url = f'{node_backend_url}/api/users/favorites/{email}'
        highly_rated_url = f'{node_backend_url}/api/users/reviews/highly-rated/{email}'

        favorites_response = requests.get(favorites_url)
        highly_rated_response = requests.get(highly_rated_url)

        if favorites_response.ok:
            favorites = [str(movie['mediaId']) for movie in favorites_response.json()]
            all_movie_ids.update(favorites)

        if highly_rated_response.ok:
            highly_rated = [str(movie_id) for movie_id in highly_rated_response.json()]
            all_movie_ids.update(highly_rated)

    return list(all_movie_ids)

# Function to construct user-item interaction matrix
def construct_interaction_matrix(movie_ids, movies_df):
    valid_ids = set(movies_df['id']) & set(movie_ids)
    interactions = pd.DataFrame(0, index=['user'], columns=movies_df['id'])
    interactions.loc['user', list(valid_ids)] = 1
    return interactions

# Function to compute item-item similarity and generate recommendations
def item_based_recommendations(interaction_matrix, movies_df, top_n=10):
    # Compute item-item similarity
    cosine_sim = cosine_similarity(interaction_matrix.T)
    cosine_sim_df = pd.DataFrame(cosine_sim, index=interaction_matrix.columns, columns=interaction_matrix.columns)

    # Aggregate similarities for items the user has interacted with
    user_profile = interaction_matrix.loc['user']
    similar_items = cosine_sim_df.dot(user_profile).sort_values(ascending=False)

    # Filter out items the user has already interacted with
    recommendations = similar_items[~similar_items.index.isin(user_profile[user_profile > 0].index)]

    # Return top N recommendations
    return recommendations.head(top_n).index.tolist()
