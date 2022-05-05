# Web for Slave Voyage

​	Hello guys. This project is mainly working for the visualization of the slave voyage database. It's a more adaptable version for developers of the back-end to have a look at the data, without professional knowledge of Django. Unfortunately, I have not completed it. Do not hesitate to continue the work and ask me any questions. In the following parts, I will tell you what I have done and details about the code.



## Quick Start

​	You will want to have a look at the website in the very beginning. 

1. Download the code

   ```shell
   git clone https://github.com/XinnaPan/Slave_Voyage.git
   ```

2. Authorization

   ​	Request the authorization and change the sample in src\utils\authorization.js to yours. By the way, I added the auth into the code before and it worked well. So it's my first time to separate it to a file and I have not tried on it. The authorization will be used in src\services\index.js\gen. So you will want to see what happens in this file if bug appears.

   ```js
   export default {
       authorization: {
          	"Authorization":'Token ***************', /* change **** part */
           "Content-Type": "multipart/form-data"
       }
   }
   ```

3. Install the packages

   ```shell
   npm install 
   ```

   It will cost some time to install.

4. Run the project

   ```shell
   npm run start
   ```

   You only need to do step 1-3 once. Then just do step 4 to start the project in the future development.

5. See the web

   Visit [http://localhost:7000](http://localhost:7000/) on your local browser. If error, open console to see what happens.

## Code Detail

​	In general, I will tell you about the tech stack I used and some important tutorial you will want to have a look at.

1. tech stack

   [UmiJS]: https://umijs.org/	"In my opinion, it's a framework based on framework. It means umi is implemented based on react to help you develop more conveniently on react Web. You don't need to install some package separately since they are packed in the umi, so you only need to install umi to get several functions. More professionally, it's called a scaffold. You will want to see some tutorial in its official website to know more about this framework. "
   [React]: https://reactjs.org/
   [Antd]: https://ant.design/	"It's a package used for optimizing the components, especially in the styles and functions. It contains almost all components you want, like form, table, button and even menu, navigation, layout and so on. You don't need to write css for each component any more. But if you have special idea, you can still use css to overwrite the styles. "

   Also you need to learn some basic knowledge for react development like  [ES2015+](http://es6.ruanyifeng.com/) , [dva](https://github.com/dvajs/dva), [Node.js](https://nodejs.org/), [Git](https://git-scm.com/).

2. code structure

   ```bash
   ├── dist/               # Default build output directory
   ├── mock/               # Mock files 
   ├── public/             # Static resource 
   ├── src/                # Source code
   │ ├── components/       # Components
   │ ├── layouts/          # Common Layouts
   │ ├── locales/          # i18n resources
   │ ├── models/           # Global dva Model
   │ ├── pages/            # Sub-pages and templates
   │ ├── services/         # Backend Services
   │ │ ├── api.js          # API configuration
   │ │ └── index.js        # API export
   │ ├── themes/           # Themes
   │ │ ├── default.less    # Less variable
   │ │ ├── index.less      # Global style
   │ │ ├── mixin.less      # Less mixin
   │ │ └── vars.less       # Less variable and mixin
   │ ├── utils/            # Utility
   │ │ ├── config.js       # Application configuration
   │ │ ├── constant.js     # Static constant
   │ │ ├── index.js        # Utility methods
   │ │ ├── request.js      # Request function(axios)
   | | ├── authorization.js# Your token to get access to database
   │ │ └── theme.js       	# Style variables used in js
   ├── .editorconfig       
   ├── .env                
   ├── .eslintrc           
   ├── .gitignore          
   ├── .prettierignore     
   ├── .prettierrc         
   ├── .stylelintrc.json   
   ├── .travis.yml         
   └── .umirc.js           
   └──  package.json      
   ```

3. where are the pages?

   ###### 	If you never use umi, you will get lost in the code structure. If you only need to see the codes for the pages, they are located on src/pages. Each page is in the same name folder. The page layout is almost in index.js, with some components implemented separately under the components folder. For example, the user page contains Filter, List and Modal, all 3 components self designed using the rule of React. You can find the implementation of Filter in src/pages/user/components/Filter.js.

   ​	The model.js mainly works for the data connection in different components and it's implemented and managed by umi. You don't need to care too much about how umi uses model.js to work as dva, but just create the model and write the similar-formatted class like what I do. You will know more details about how to write the model and what's the function of each part in the model in Umi tutorial.



## Functions and Bugs

​	As I said above, I have not completed the web. There are still problems waiting to be solved. Currently most work is in the user page. 

###### User page

1. Filter

   - [x] Able to show all titles and let the user choose the key from them; (Use Cascader)

   - [x] Able to add a line if more key values need to get inputted;  (By clicking the plus button in web)

   - [x] If the key need integer as value, use the slide bar to input. Or use the input component;

   - [ ] Support multiple values connected to one key; 

     ​	Currently I use dictionary to record the value and key, and so later value will cover the previous one. You need to check whether the key is in the dictionary at first and follow the rule of what backend need to do the filtration to connect multiple values and store it.

   - [ ] Delete a line if user does not want it now; 

     ​	You can see I exactly delete it in the UI. But I'm not sure whether it really disappears in the data sent to backend. Test it and debug here.

   - [ ] Autocomplete the input part; 

     ​	I have finished part of this. But you will find some problems here. That's you can not input continuously in the input component, which will lost the focus soon. Actually each time you can only input 1 character before you focus it again. But I add a delay function so you can type 2 or 3 each time. But it's obvious that the problem does not be solved completely. 

     ​	I know the reason. The input component is  implemented separately from the main component. Every time the input gets updated, the main component will get updated. Then the main component will get confused which part it was focused on last time. I'm not sure whether it can work if just merge the code to the main component. 

   - [ ] Use the search button to do the filtration;

     ​	I have implemented this actually, but later I added more functions and so I'm not sure whether it can work well now. You need to pack the data of all keys and inputs, following the rule the backend tells you. I have finished the later operations likes connecting to the backend, getting the response and filling the data into the table.

      

2. Modal for choosing columns you want to see

   - [x] Click the "Add Title" button and the modal shows all titles the database have in a tree structure. Choose one or more titles by clicking the checked boxes. Click OK and the modal hides. See the data matching these titles in the following table;
   - [x] Currently, the modal will show the titles you set in config page;

3. Table

   ​	The component for the table showing the database is List. 

   - [x] Show the data of titles you choose in the modal;

   - [x] Spitted all data to pages;

   - [ ] Sort the data;

     ​	I have implemented this before. You can just click the titles to make that column sorted. But I am not sure whether it can work well now. The sort sign in the titles is designed by Antd. You will want to know how to activate the function by clicking the sign from [here](https://ant.design/components/table/).

   - [ ] Make the table look more elegant;

     It's a little ugly currently.... Try to use more layout tricks.

###### Config page

- [ ] Show all titles and let user select some. Only those selected will show in the Modal of the user page;



### Mock	

​	I have to declare what I have done using Mock and if the backend will not do the same thing, you have to delete the relevant parts. Mock will not work in production mode (compared to development mode). 

###### Login part

​	Actually the login part is fake. I do not remember the backend provides relevant API currently. I use "Mock" function provided by Umi to mock this part now. And it's very simple and hard to use. Delete it if you don't want to do more.

###### Routes

​	Currently the routes for each page are decided by the backend(actually the mock). The frontend will request the route, its id, its icon and so on. If the backend will not implement this finally, you have to set it in the frontend, like using a file to store the data similar to the structure in mock.

###### Access right to pages

​		Different users are allowed to get access to different pages. For example, admin can enter all pages but guest can only visit some.  However,  the backend do not support it right now. The mock will use the id of pages to distinguish them and set the access right for different roles. You can just delete the relevant part or use a file in the frontend to store the data similar to the structure in mock.

​	

### Good Luck!









