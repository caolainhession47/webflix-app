import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def fetch_user_movie_ids(email):
    node_backend_url = 'http://localhost:5000'  # or the production URL
    favorites_url = f'{node_backend_url}/api/users/favorites/{email}'
    highly_rated_url = f'{node_backend_url}/api/users/reviews/highly-rated/{email}'

    favorites_response = requests.get(favorites_url)
    highly_rated_response = requests.get(highly_rated_url)

    if favorites_response.ok and highly_rated_response.ok:
        favorites = [movie['mediaId'] for movie in favorites_response.json()]
        highly_rated = [int(movie_id) for movie_id in highly_rated_response.json()]
        return favorites + highly_rated
    else:
        return []
    
def get_content_based_recommendations(movie_ids, movies_df):
    # Ensure combined features column exists
    if 'combined_features' not in movies_df.columns:
        movies_df['director'] = movies_df['director'].str.replace(' ', '_')
        movies_df['cast'] = movies_df['cast'].str.replace(' ', '_')
        movies_df['combined_features'] = 2 * (movies_df['director'] + ' ') + movies_df['genres'].str.replace('|', ' ') + ' ' + movies_df['overview'] + ' ' + movies_df['cast'].str.replace('|', ' ')
    
    # Generate TF-IDF matrix for combined features
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['combined_features'])

    # Compute cosine similarity matrix based on TF-IDF vectors
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    all_recommendations = []
    for movie_id in movie_ids:
        idx = movies_df.index[movies_df['id'] == movie_id].tolist()
        if not idx:
            continue  # Skip if movie_id not found
        idx = idx[0]

        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:11]  # Get top 10 similar movies
        movie_indices = [i[0] for i in sim_scores]
        
        for i in movie_indices:
            all_recommendations.append({
                'id': movies_df.iloc[i]['id'],
                'title': movies_df.iloc[i]['title'],
                'rating': movies_df.iloc[i]['vote_average']
            })

    # Sort all recommendations by rating in descending order
    all_recommendations.sort(key=lambda x: x['rating'], reverse=True)

    # Remove duplicates from recommendations concisely
    unique_recommendations = list({rec['id']: rec for rec in all_recommendations}.values())

    return unique_recommendations
