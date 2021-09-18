# dns-server 


### there are two types of urls in this standard

### type1 : specific url
```
format: spec-xx-yy-ll1-{...content-of-ll1...}-ll2-{..content-of-ll2...}

spec: is spec and is just a fixed const plain text 
xx: is a string variable of 2 digits like '00','01','02'....,'99' , totally 100 number specifications
xx: represent which specific it is 
yyy: is string of 3 digits like '000','001','002'... ,totally 1000 numbers
yyy: represent how many pairs are there after 

pairs like below:
00-{}  //nothing pair
20-{...20 length string inside...} //20 length string


we define the 00 to be used currently for CDN meson standard example:
/////spec 00 and 2 pairs
//// you can bind backup domains of  mesontrackingx.com simply to this dns-server
//// all the thisistag will be mapped to meson-dns-ip standard
spec-00-02-015-fikcbikcafkcdax-019-thisisthebinddomain.mesontracking.com
spec-00-02-015-fikcbikcafkcdax-019-thisisthebinddomain.mesontracking2.com


///meson-dns-ip standard is a bi-directional ip-dns mapping :

 static tagToIp(tagstr){
        let result="";
        for (let i = 0; i < tagstr.length; i++) {
                let tchar=tagstr.charAt(i);
                if(tchar=='k'){
                    result = result + "."
                }else if(tchar=='x'){
                    break;
                }else{
                    result = result +String.fromCharCode(tchar.charCodeAt(0)-49);
                }
        }
        return result
    }


```
### type2 : plain url , no meaning