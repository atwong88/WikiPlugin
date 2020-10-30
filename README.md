# WikiPlugin
The WikiPlugin: A new lens for viewing the world’s knowledge.

Project by: Matt Canute, Young-Min Kim, Donggu Lee, Suraj Swaroop, Adriena Wong

Wikipedia is the largest online encyclopedia with over 6 million English articles, increasing by over
17,000 articles every month. However, some article topics can have a wide range in difficulty, and
some articles can often be overwhelming, with a seemingly endless chain of sub-topics to understand
beforehand. Wouldn’t it be nice to know roughly how much time you’d need in order to understand an
article’s main points and concepts? It would also be useful to know the minimum number of related
articles you’d need to read.

Our goal with this project was to address the following two questions:
1. Are there certain features or patterns of an article that could allow an analytical model to
reasonably learn how to predict whether or not the article’s concept would be difficult to
understand?
2. If so, how could we best use that tool to provide an overlay of helpful information, and to
guide the reader’s experience throughout the article?

We created a Chrome extension that makes use of a model for predicting Wikipedia article difficulty. It helps readers identify the most relevant articles on a certain Wikipedia page by recolouring all hyperlinks based on its historical click volume. The article's estimated read-time is presented to the user in the plugin pop-up, which is based on the probability of an article being difficult based on our model.

We created a Flask webpage to display some interesting statistics about a certain Wikipedia article or on Wikipedia in general. Based on a certain Wikipedia article, users can see the graphically (based on popular paths taken by other users to reach the current article) and semantically (based on the article's text) similar articles. There is also a page displaying the most popular article topics of the specified month and year. Finally, we have a simplication priority queue page that could potentially be useful for the Wikimedia group to determine which 'difficult' articles should be considered for their Simple English Wikipedia initiative based on their difficulty score from our model as well as the article's historical click volume.

# Project Report
[final_report.pdf](https://github.com/atwong88/WikiPlugin/files/5462867/final_report.pdf)

# WikiPlugin Chrome Extension
![image](https://user-images.githubusercontent.com/29899423/97657433-34bd9180-1a40-11eb-8c10-441c631eafc2.png)

# WikiPlugin Analysis Webpage
Front Page
![image](https://user-images.githubusercontent.com/29899423/97657068-5407ef00-1a3f-11eb-9052-af17a9d609dc.png)

User Input Page
![image](https://user-images.githubusercontent.com/29899423/97657258-ce387380-1a3f-11eb-9dc1-24844e052d66.png)

Graphical Similarity Page
![image](https://user-images.githubusercontent.com/29899423/97657292-e3150700-1a3f-11eb-96e5-c3ccb9c271c3.png)

Semantic Similarity Page
![image](https://user-images.githubusercontent.com/29899423/97657310-f031f600-1a3f-11eb-8371-ae1174cc52e7.png)

Wikipedia Topics Statistics Page
![image](https://user-images.githubusercontent.com/29899423/97657322-fb852180-1a3f-11eb-8ff9-6b54415f16e2.png)

Simple Wikipedia Suggestions Page
![image](https://user-images.githubusercontent.com/29899423/97657377-15beff80-1a40-11eb-9a31-1b160feac713.png)

<hr>

# Raw datasets sources
<b>clickstream:</b> enwiki (second file) from https://dumps.wikimedia.org/other/clickstream/2020-01/ <br>
<b>article text:</b> multistream1 and index1 from https://dumps.wikimedia.org/enwiki/20200101/ <br>

# How to run the Plugin code
1. Go to the Extension Management page: chrome://extensions
	- or go to the Chrome menu, go to <b>More Tools<b> -> <b>Extensions<b> <br>
2. Enable Developer Mode by clicking the toggle <br>
3. Click <b>LOAD UNPACKED<b> <br>
4. Select the "plugin" directory from this project <br>
5. Go to any Wikipedia page and try it out! <br>
6. To point to a sqlite database, you can download this one https://drive.google.com/file/d/1-oMlCy3txpK9NWvlQc_3Gp0WNImhlbGw/view?usp=sharing
7. Upload the above file to the extension popup.

# How to run the flask app
1. Run "pip install flask", "pip install flask-wtf", and "pip install sqlalchemy"
2. Make sure you have run.py and web_application folder in the main directory
3. Go to the main directory and run "python run.py"

# Data Pipeline
1. Please read 'DataPipeline.md'
<hr>
	    	
