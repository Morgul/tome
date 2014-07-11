Title: Directory Test Page
Tags: test; not-news; other-thing

## Testing Directory support

If the url for this test page is `/foo/bar/dir-test` then we've successfully handled directories! Isn't that neat?

## More link test

So, time to test more links, see what I like:

* [Foo](foo)
* [Foo](/wiki/foo)
* [Bar](/bar)
* [MOAR EXTERNAL LINKZ](http://ssrpg.skewedaspect.com/_activity)

## Syntax Test

```javascript
// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiPageController($scope, wikiPage)
{
    $scope.wikiPath = wikiPage.wikiPath || "welcome";

    $scope.page = wikiPage.get($scope.wikiPath);
    $scope.$root.title = $scope.page.title;

    $scope.markdown = "# Welcome\nThis is my nice, wonderful welcome page! Don't you just love it?";
} // end WikiPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('WikiPageController', ['$scope', 'wikiPage', WikiPageController]);

// ---------------------------------------------------------------------------------------------------------------------
```

## Bacon Ipsum

Bacon ipsum dolor sit amet tongue pork loin corned beef landjaeger. Jowl tongue ham meatball, fatback salami capicola 
[leberkas](http://google.com) hamburger andouille. Short ribs short loin brisket capicola. Shank fatback porchetta swine 
shankle bacon ball  tip tri-tip drumstick. Biltong short loin chicken pork strip steak beef ribs andouille venison 
fatback turkey spare ribs flank.

Turkey pork chop tri-tip, frankfurter fatback venison pork. Boudin drumstick short ribs hamburger prosciutto leberkas 
cow filet mignon jerky pork belly t-bone pork loin sausage. Ham tongue cow, chuck t-bone shankle ball tip sirloin doner 
pancetta filet mignon. Turducken pork chop ground round jowl jerky meatball pancetta doner cow pork brisket ball tip.

Bacon pork belly rump, tongue biltong ball tip brisket. Spare ribs rump shoulder tongue, beef ball tip beef ribs pork 
belly strip steak shank corned beef short loin frankfurter drumstick. Landjaeger pig flank short ribs beef ribs. Biltong 
pig porchetta tongue prosciutto ham hock chuck spare ribs rump short loin bacon ribeye. Ball tip pork belly pork chop 
leberkas corned beef, pork loin kevin. Biltong boudin turducken strip steak andouille filet mignon shoulder short loin 
doner tri-tip jowl ham hock.

Short ribs t-bone leberkas pork loin, fatback turkey ball tip jowl shank shoulder frankfurter. Prosciutto pancetta 
venison, short loin tri-tip porchetta turducken chuck salami. Tail salami drumstick t-bone, jerky kielbasa ribeye 
hamburger brisket ham hock andouille pork loin turducken. Cow corned beef pancetta, ham meatball boudin bresaola t-bone 
pork loin kielbasa chuck ham hock shankle sirloin tongue. Porchetta jowl shoulder capicola tri-tip, strip steak shank 
biltong pork jerky sausage ham.

Ground round doner sausage capicola kielbasa, pork ball tip bresaola. Shoulder bacon spare ribs venison. Rump cow 
meatloaf, pork bacon kielbasa sausage strip steak capicola flank. Rump chuck sausage drumstick, shank swine bresaola 
filet mignon shankle pancetta prosciutto. Porchetta capicola kielbasa strip steak bacon tenderloin meatloaf chicken 
brisket jerky tail ground round. Sirloin pancetta bresaola ham hock, prosciutto tongue salami.

## Bacon Ipsum

Bacon ipsum dolor sit amet tongue pork loin corned beef landjaeger. Jowl tongue ham meatball, fatback salami capicola 
[leberkas](http://google.com) hamburger andouille. Short ribs short loin brisket capicola. Shank fatback porchetta swine 
shankle bacon ball  tip tri-tip drumstick. Biltong short loin chicken pork strip steak beef ribs andouille venison 
fatback turkey spare ribs flank.

Turkey pork chop tri-tip, frankfurter fatback venison pork. Boudin drumstick short ribs hamburger prosciutto leberkas 
cow filet mignon jerky pork belly t-bone pork loin sausage. Ham tongue cow, chuck t-bone shankle ball tip sirloin doner 
pancetta filet mignon. Turducken pork chop ground round jowl jerky meatball pancetta doner cow pork brisket ball tip.

Bacon pork belly rump, tongue biltong ball tip brisket. Spare ribs rump shoulder tongue, beef ball tip beef ribs pork 
belly strip steak shank corned beef short loin frankfurter drumstick. Landjaeger pig flank short ribs beef ribs. Biltong 
pig porchetta tongue prosciutto ham hock chuck spare ribs rump short loin bacon ribeye. Ball tip pork belly pork chop 
leberkas corned beef, pork loin kevin. Biltong boudin turducken strip steak andouille filet mignon shoulder short loin 
doner tri-tip jowl ham hock.

Short ribs t-bone leberkas pork loin, fatback turkey ball tip jowl shank shoulder frankfurter. Prosciutto pancetta 
venison, short loin tri-tip porchetta turducken chuck salami. Tail salami drumstick t-bone, jerky kielbasa ribeye 
hamburger brisket ham hock andouille pork loin turducken. Cow corned beef pancetta, ham meatball boudin bresaola t-bone 
pork loin kielbasa chuck ham hock shankle sirloin tongue. Porchetta jowl shoulder capicola tri-tip, strip steak shank 
biltong pork jerky sausage ham.

Ground round doner sausage capicola kielbasa, pork ball tip bresaola. Shoulder bacon spare ribs venison. Rump cow 
meatloaf, pork bacon kielbasa sausage strip steak capicola flank. Rump chuck sausage drumstick, shank swine bresaola 
filet mignon shankle pancetta prosciutto. Porchetta capicola kielbasa strip steak bacon tenderloin meatloaf chicken 
brisket jerky tail ground round. Sirloin pancetta bresaola ham hock, prosciutto tongue salami.

## Bacon Ipsum

Bacon ipsum dolor sit amet tongue pork loin corned beef landjaeger. Jowl tongue ham meatball, fatback salami capicola 
[leberkas](http://google.com) hamburger andouille. Short ribs short loin brisket capicola. Shank fatback porchetta swine 
shankle bacon ball  tip tri-tip drumstick. Biltong short loin chicken pork strip steak beef ribs andouille venison 
fatback turkey spare ribs flank.

Turkey pork chop tri-tip, frankfurter fatback venison pork. Boudin drumstick short ribs hamburger prosciutto leberkas 
cow filet mignon jerky pork belly t-bone pork loin sausage. Ham tongue cow, chuck t-bone shankle ball tip sirloin doner 
pancetta filet mignon. Turducken pork chop ground round jowl jerky meatball pancetta doner cow pork brisket ball tip.

Bacon pork belly rump, tongue biltong ball tip brisket. Spare ribs rump shoulder tongue, beef ball tip beef ribs pork 
belly strip steak shank corned beef short loin frankfurter drumstick. Landjaeger pig flank short ribs beef ribs. Biltong 
pig porchetta tongue prosciutto ham hock chuck spare ribs rump short loin bacon ribeye. Ball tip pork belly pork chop 
leberkas corned beef, pork loin kevin. Biltong boudin turducken strip steak andouille filet mignon shoulder short loin 
doner tri-tip jowl ham hock.

Short ribs t-bone leberkas pork loin, fatback turkey ball tip jowl shank shoulder frankfurter. Prosciutto pancetta 
venison, short loin tri-tip porchetta turducken chuck salami. Tail salami drumstick t-bone, jerky kielbasa ribeye 
hamburger brisket ham hock andouille pork loin turducken. Cow corned beef pancetta, ham meatball boudin bresaola t-bone 
pork loin kielbasa chuck ham hock shankle sirloin tongue. Porchetta jowl shoulder capicola tri-tip, strip steak shank 
biltong pork jerky sausage ham.

Ground round doner sausage capicola kielbasa, pork ball tip bresaola. Shoulder bacon spare ribs venison. Rump cow 
meatloaf, pork bacon kielbasa sausage strip steak capicola flank. Rump chuck sausage drumstick, shank swine bresaola 
filet mignon shankle pancetta prosciutto. Porchetta capicola kielbasa strip steak bacon tenderloin meatloaf chicken 
brisket jerky tail ground round. Sirloin pancetta bresaola ham hock, prosciutto tongue salami.

