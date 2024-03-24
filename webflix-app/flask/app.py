from flask import Flask, request, jsonify
import pandas as pd
import requests
from content_based import get_content_based_recommendations
from hybrid import hybrid_recommendations
from collaborative import construct_interaction_matrix, item_based_recommendations
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Load the movies dataset just once when the app starts
movies_df = pd.read_csv('top10K.csv')
movies_df.fillna('', inplace=True)
movies_df['id'] = movies_df['id'].astype(str)  # Ensure ID consistency

# Function to get user movie IDs from the backend
def fetch_user_movie_ids(email):
    node_backend_url = 'http://localhost:5000'
    favorites_url = f'{node_backend_url}/api/users/favorites/{email}'
    highly_rated_url = f'{node_backend_url}/api/users/reviews/highly-rated/{email}'

    favorites_response = requests.get(favorites_url)
    highly_rated_response = requests.get(highly_rated_url)

    movie_ids = []
    if favorites_response.ok:
        favorites = [str(movie['mediaId']) for movie
in favorites_response.json()]  
        movie_ids.extend(favorites)

    if highly_rated_response.ok:
        highly_rated = [str(movie_id) for movie_id in highly_rated_response.json()] 
        movie_ids.extend(highly_rated)

    return movie_ids

# Endpoint for content-based recommendations
@app.route('/recommend/content-based', methods=['POST'])
def recommend_content_based():
    data = request.get_json()
    user_email = data['email']
    movie_ids = fetch_user_movie_ids(user_email)

    if movie_ids:
        recommendations = get_content_based_recommendations(movie_ids, movies_df)
        return jsonify(recommendations)
    else:
        return jsonify({"message": "No movie IDs found for user, please add movies to favorites or rate movies to get recommendations!"}), 200
    
    
# Endpoint for hybrid recommendations
@app.route('/recommend/hybrid', methods=['POST'])
def recommend_hybrid():
    data = request.get_json()
    user_emails = data.get('emails', [])

    if not user_emails:
        return jsonify({"error": "No emails provided"}), 400

    recommended_movies = hybrid_recommendations(user_emails, movies_df)

    if recommended_movies:
        return jsonify(recommended_movies)
    else:
        return jsonify({"message": "No movie IDs found for the users, please add movies to favorites or rate movies to get recommendations!"}), 200

# Endpoint for collaborative recommendations
@app.route('/recommend/collaborative', methods=['POST'])
def recommend_collaborative():
    data = request.get_json()
    user_emails = data['emails']
    movie_ids = []
    for email in user_emails:
        movie_ids.extend(fetch_user_movie_ids(email))

    if movie_ids:
        interaction_matrix = construct_interaction_matrix(movie_ids, movies_df)
        recommendations = item_based_recommendations(interaction_matrix, movies_df)
        recommended_movies = movies_df[movies_df['id'].isin(recommendations)][['id', 'title']]
        return jsonify(recommended_movies.to_dict('records'))
    else:
        return jsonify({"error": "No movie IDs found for users"}), 404

if __name__ == '__main__':
    app.run(debug=True)
