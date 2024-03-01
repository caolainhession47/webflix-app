from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from collaborative import fetch_user_movie_ids

def hybrid_item_similarity(movies_df):
    # Generate TF-IDF matrix for 'combined_features'
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['combined_features'])

    # Compute cosine similarity matrix based on TF-IDF vectors
    cosine_sim_content = cosine_similarity(tfidf_matrix, tfidf_matrix)

    return cosine_sim_content

def hybrid_recommendations(emails, movies_df):
    movie_ids = fetch_user_movie_ids(emails) 

    # Compute enhanced item-item similarity using both interactions and content features
    cosine_sim_content = hybrid_item_similarity(movies_df)

    all_recommendations = []
    for movie_id in movie_ids:
        idx = movies_df.index[movies_df['id'] == movie_id].tolist()
        if idx:
            idx = idx[0]
            sim_scores = list(enumerate(cosine_sim_content[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            count = 0  # Counter for recommendations per media
            for i, score in sim_scores[1:]:  # Skip the first one as it's the same movie
                if movies_df.iloc[i]['id'] not in movie_ids and movies_df.iloc[i]['id'] not in all_recommendations:
                    all_recommendations.append(movies_df.iloc[i]['id'])
                    count += 1
                    if count >= 10:  # Limit to 10 recommendations per media
                        break

    # Fetch details for all recommended movies
    recommended_movies_details = movies_df[movies_df['id'].isin(all_recommendations)]

    # Sort by rating in descending order and select top N
    recommended_movies_sorted = recommended_movies_details.sort_values(by='vote_average', ascending=False)
    return recommended_movies_sorted.to_dict('records')