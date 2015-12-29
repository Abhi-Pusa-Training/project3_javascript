
var fs1 = require('fs');
var LineByLineReader = require('line-by-line'),
    //lr = new LineByLineReader('WDI_Data.csv');
    lr = new LineByLineReader('WDI_Data.csv');
    //var lines =[];
    var heading = [];
    var words=[];
    var count=0;
    var flag=0;
    var flag1=0;
    var array_word =[];                                                         //for stroring the data
    var array_country=[];                                                       //for storing the country
    //var store_data="[";
    var obj={};
    var json=[];

    function compare(a,b) {
    if (a["gdp"] < b["gdp"])
    {
      console.log(a["gdp"]+":"+b["gdp"]);
      return -1;
    }

    else if (a["gdp"] > b["gdp"])
    {
      console.log(a["gdp"]+":"+b["gdp"]);
      return 1;
    }

    return 0;
    }
    // fs1.appendFile("./test.txt",store_data, function(err) {
    //   if(err) {
    //       return console.log(err);
    //   }
    //
    //   //console.log("The file was saved!:"+count++);
    // });

lr.on('error', function (err) {
	// 'err' contains error object
  console.log(err);
});

lr.on('line', function (line) {
	// 'line' contains the current line without the trailing newline character.
  //console.log(line[0]);
  if(flag==0)
  {
    heading = line.split(',');                                                  //spliting the heading part
    flag=1;
    /*for(var j=0;j<heading.length;j++)
    {
      console.log(heading[j]);
    }*/
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

        //console.log(words.length);
        //store_data="{";
        //var obj = {};
        //var flag1=0;

      if(words[2]=="GDP per capita (constant 2005 US$)")
      {
        //console.log("We are inside the operation");
        //for(var i=0;i<words.length;i++)
        //{
          //console.log(heading[i]+words[i]);
          flag1=0;
          //if((heading[i]=="Country Name") || (heading[i]=="2005"))
          //{
            //console.log();
            obj["country"]=words[0];
            obj["gdp"]=(words[50]=="")?0:parseFloat(words[50]);

          //}

        //}
      }

      if(words[2]=="GNI per capita (constant 2005 US$)")
      {
        //console.log("We are inside the operation");
        //for(var i=0;i<words.length;i++)
        //{
          //console.log(heading[i]+words[i]);

          //if((heading[i]=="Country Name") || (heading[i]=="2005"))
          //{
            //console.log();
            //obj[heading[i]]=words[i];
            //obj["country"]=heading[0];
            flag1=1;
            obj["gni"]=(words[50]=="")?0:parseFloat(words[50]);
          //}

        //}
      }
      if(flag1==1)
      {
        json.push(obj);
        obj={};
        flag1=0;
        //console.log(json);
      }

  }
});

lr.on('end', function () {



  json.sort(compare);
  console.log(json.length);
 json = json.slice(json.length-16, json.length-1);
   console.log(json.length);
  fs1.appendFile("./test.json", JSON.stringify(json) , function(err) {
    if(err) {
        return console.log(err);
    }
  });

});
