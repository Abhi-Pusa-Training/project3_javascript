
var fs1 = require('fs');
var LineByLineReader = require('line-by-line'),
    //lr = new LineByLineReader('WDI_Data.csv');
    lr = new LineByLineReader('WDI_Data.csv');
    //var lines =[];
    var heading = [];
    var words=[];
    var count=0;
    var flag=0;
    var cont_coun ={};                                                         //for stroring the data
    var array_country=[];                                                       //for storing the country
    //var store_data="[";
    var obj1 ={};
    var json=[];

    var obj = {
      Africa:{},
      Asia:{},
      "North America":{},
      "South America":{},
      Europe:{},
      Oceania:{}
    };


lr.on('error', function (err) {
	// 'err' contains error object
  console.log(err);
});

lr.on('line', function (line) {

  if(flag==0)
  {
    heading = line.split(',');                                                  //spliting the heading part
    flag=1;

    fs1.readFile('Countries-Continents-csv.csv', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      //console.log(data);
      var split_cont = data.split('\n');
      //console.log(split_cont.length);
      for(var c=1;c<split_cont.length;c++)
      {
        var each_word=split_cont[c].split(',');
          obj1[each_word[1]]=each_word[0];
      }
      console.log(obj1);

    });
  }
  else
  {

        var words = line.split(',');

        var k=0;
        //var flag=1;
        var temp_str="";
        for(var j=0;j<words.length;j++)                                              //traversing  the completeing the word
        {
          //console.log(words[j]);
          if(words[j].charAt(0)=='"')                                                 //if any word's first letter is "
          {
            //console.log("yuppie i found one");
            k=0;
            temp_str=words[j]
            do
            {
              k++;
              temp_str=temp_str.concat(","+words[j+k]);
            } while(words[j+k].charAt(words[j+k].length-1)!='"')
            //console.log(temp_str);
            words[j]=temp_str;
            words[j] = words[j].replace('"','');
            words[j] = words[j].replace('"','');
            for(var m=j+1;m<words.length-k;m++)
            {
              words[m]=words[m+k];
            }

            for(var m=0;m<k;m++)
            {
              words.pop();
            }

          }
        }
      if((words[2]=="GDP per capita (constant 2005 US$)") && (obj[obj1[words[0]]] !== undefined))
      {
        //console.log("We are inside the operation");
        var tmp={};
        for(var i=4;i<words.length;i++)
        {
              if(words[i]=="")
                {
                  obj[obj1[words[0]]][heading[i]]= isNaN(parseInt(obj[obj1[words[0]]][heading[i]]))?0:(parseInt(obj[obj1[words[0]]][heading[i]]));
                }
              else
                {
                  obj[obj1[words[0]]][heading[i]]= isNaN(parseInt(obj[obj1[words[0]]][heading[i]]))?0:(parseInt(obj[obj1[words[0]]][heading[i]]))+parseInt(words[i]);
                }
        }
      }
}

});

lr.on('end', function () {
  //json.push(obj);
  for(var y=1960;y<=2015;y++)
  {
    var obj_temp={};
    obj_temp["year"]=y;
    obj_temp["Africa"]=obj["Africa"][y];
    obj_temp["Asia"]=obj["Asia"][y];
    obj_temp["North America"]=obj["North America"][y];
    obj_temp["South America"]=obj["South America"][y];
    obj_temp["Europe"]=obj["Europe"][y];
    obj_temp["Oceania"]=obj["Oceania"][y];
    json.push(obj_temp);
  }
  console.log(json);
  fs1.writeFile("./coun_cont.json", JSON.stringify(json) , function(err) {
    if(err) {
        return console.log(err);
    }
  });

});
