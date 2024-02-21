# Getting Started

1. Install NodeJS version 18.16.0
2. Install dependencies
 - > npm i
3. Running
 - > npm run dev

### Dependencies
- Chokidar
  - It was used to watch the input folder. It has an easier interface than NodeJS fs watch.

# Explanation
First of all, there is a folder called '_input/' in root directory. This folder is responsible for reading all files inserted inside there and executing the algorithm.

My solution consists of a few steps:
1. Read the inserted file in folder '_input'
2. Separate the drone data and packages data
3. And, insert the remaing packages inside each drone trip using a specific class called RandomDelivery.

By the end of this process, it will be created an output file in folder '_output/'.