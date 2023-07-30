# 🐦 Tweet Classifier 🐦

Welcome to the Tweet Classifier repository! This tool utilizes deep learning, specifically Brain.js, to classify tweets!

## Key Features

- Utilizes deep learning with Brain.js for efficient tweet classification
- Tokenizes and stems tweets to build a comprehensive words dictionary

## How It Works

1. **Data Preprocessing:**
   - Tweets are tokenized and stemmed to create a meaningful words dictionary.

2. **Model Training:**
   - The preprocessed data is fed into the model for training using Brain.js.

3. **Classification:**
   - When you make a request with two tweets, the model processes them.
   - The model converts the tweets into a Bag-of-Words (BoW) representation, e.g., [0, 0, 0, 0, 1].
   - The BoW representation is then fed into the trained model for classification.

4. **Results:**
   - The model returns the classification probabilities for each tweet.
   - For example: {tweet1: 0.010000, tweet2: 0.09000} indicates the probability of each tweet belonging to a specific class.

## About the Author

Briefly introduce yourself here. Talk about your passion for coding and what inspired you to create this awesome Tweet Classifier!

Connect with me on [Linkedin](https://www.linkedin.com/in/pedrokalebdej1/) or follow me on [Twitter](https://twitter.com/Je1Pedro) to stay updated with my latest projects.

## License

[MIT]
