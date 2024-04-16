To run the image population script:

1. Prior must have two text files, one seen_lines for already ran schools and the other for schools to run. Currently being ran by state.

2. Secrets.json, yeah

3. Run 'test.py' in image folder. This is the script responsible for using google-images-api to get campus photos. It then outputs a 'names.csv' file that updates with 'title','image' Dataframe.

4. Finally, run 'joining-images' in notebooks that merges our "schoolSchema.csv" and the "names.csv" to update respective 'title' with 'image'.
