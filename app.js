//BUDGET CONTROLLER
var budgetController=(function()
{
var Expense=function(id,description,value)
{
this.id=id;
this.description=description;
this.value=value;
this.percentage=-1;
};
Expense.prototype.calcPercentage=function(totalIncome)
{
    if(totalIncome>0)
    {
        this.percentage=Math.round((this.value/totalIncome)*100);
    }
    else{
        percentage=-1; 
    }

}
Expense.prototype.getPercentage=function()
{
    return this.percentage;
};
var Income=function(id,description,value)
{
this.id=id;
this.description=description;
this.value=value;
};
var calculateTotal=function(type)
{
    var sum=0;
data.allItems[type].forEach(function(cur)
{
sum+=cur.value;
});
data.totals[type]=sum;
};
var data={
    allItems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1
}
return{
    addItem:function(type,des,val)
    { var newItem,ID;
        //create new id
        if(data.allItems[type].length>0)
        {
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
        }
        else {
            ID=0;
        }
        // create new item based on inc and exp
    if(type==='exp')
    {
     newItem=new Expense(ID,des,val);
    }
    else if(type==='inc')
    {
        newItem=new Income(ID,des,val);
    }
    // push into data structure
    data.allItems[type].push(newItem);
    //return new element
    return newItem;
    },
    deleteItem:function(type,id)
    { var ids,index;
    ids=data.allItems[type].map(function(current)
    {
      return current.id;
    });
    index=ids.indexOf(id);
    if(index!==-1)
    {
        data.allItems[type].splice(index,1);
    }
    },
    calculateBudget:function()
    {
     //1. calculate total income and total expenses
     calculateTotal('exp'); 
     calculateTotal('inc');
     //2. calculate budget
      data.budget=data.totals.inc-data.totals.exp; 
     //3. calculate percentage of income spent 
     if(data.totals.inc>0)
     {
        data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
     }
     else
     {
         data.percentage=-1;
     }
     
    },
    calculatePercentages:function()
    {
      data.allItems.exp.forEach(function(cur)
      {
          cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages:function()
    {
      var allPerc=  data.allItems.exp.map(function(cur)
        {
           return cur.getPercentage();
        });
        return allPerc;
    },
    getBudget:function()
    {
        return{
            budget:data.budget,
            totalIncome:data.totals.inc,
            totalExpenses:data.totals.exp,
            percentage:data.percentage
        }
    },
    testing:function(){
        console.log(data);
    }
};
})();

//UI CONTROLLER
var UIController=(function()
{
    DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetPanel:'.budget__value',
        incomePanel:'.budget__income--value',
        expensePanel:'.budget__expenses--value',
        percentagePanel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLable:'.item__percentage',
        dataPanel:'.budget__title--month'
    }
    var formatNumber=function(num,type)
    { var numSplit,int,dec;
     num=Math.abs(num);
     num=num.toFixed(2);
     numSplit=num.split('.');
     int =numSplit[0];
     
     if(int.length>3)
     {
        int= int.substr(0,int.length-3)+','+int.substr(int.length-3,3); 
     }
     dec=numSplit[1];
     
     return (type==='exp'?sign='-':sign='+')+' '+int +'.'+dec;
    };
    var nodeListForEach=function(list,callback)
{
    for(i=0;i<list.length;i++)
    {
        callback(list[i],i);
    }
};
return{
    getInput:function()
    {
        return{
                  type:document.querySelector(DOMstrings.inputType).value,
description:document.querySelector(DOMstrings.inputDescription).value,
value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
        
    },
    addListItem:function(obj,type)
    {  
        //create html string with placeholders
        var html,newhtml,element;
        if(type==='inc')
        { element=DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else if(type==='exp')
        { element=DOMstrings.expensesContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // replace placeholders with actual data
         newhtml=html.replace('%id%', obj.id);
         newhtml=newhtml.replace('%description%', obj.description);
         newhtml=newhtml.replace('%value%', formatNumber(obj.value,type));
        // present on ui
    document.querySelector(element).insertAdjacentHTML('beforeend',newhtml)
    },
    deleteListItem:function(selectorID)
    { var el=document.getElementById(selectorID);
     el.parentNode.removeChild(el);
    },
    clearFields:function()
    { var fields,fieldsArr;
    fields= document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
    fieldsArr=Array.prototype.slice.call(fields);
    fieldsArr.forEach(function(current,index,array)
    {
     current.value="";
    });
    fieldsArr[0].focus();
    }
    ,
    displayBudget:function(obj)
    {
        obj.budget>0?type='inc':type='exp';
     document.querySelector(DOMstrings.budgetPanel).textContent=formatNumber(obj.budget,type);
     document.querySelector(DOMstrings.incomePanel).textContent=formatNumber(obj.totalIncome,'inc');
     document.querySelector(DOMstrings.expensePanel).textContent=formatNumber(obj.totalExpenses,'exp');

     if(obj.percentage>0)
     {
        document.querySelector(DOMstrings.percentagePanel).textContent=obj.percentage+' %';
     }
     else
     {
        document.querySelector(DOMstrings.percentagePanel).textContent='----';
     }
    },
    displayPercentages:function(percentages)
    {
        var fields=document.querySelectorAll(DOMstrings.expensesPercLable);



        nodeListForEach(fields,function(current,index)
        {
            if(percentages[index]>0)
            {
                current.textContent=percentages[index]+'%';
            }
            else{
                current.textContent='---';
            }
        
        });
    },
    displayDate:function()
    {   var date,month,year;
         date=new Date();
         month=date.getMonth();
         year=date.getFullYear();
         document.querySelector(DOMstrings.dataPanel).textContent=date;

    },
    changedType:function()
    {
      var fields=document.querySelectorAll(
      DOMstrings.inputType+','+DOMstrings.inputDescription+','+DOMstrings.inputValue

      );
      nodeListForEach(fields,function(cur)
      {
cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },
    getDOMstrings:function()
    {
        return DOMstrings;
    }
};

})();

// GLOBAL APP CONTROLLER
var controller=(function(budgetCtrl,UICtrl)
{
    var setupEventListeners=function()
    {
        var DOM=UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

document.addEventListener('keypress',function(event)
{
 if(event.keyCode===13)
    {      
 ctrlAddItem();
    }
});
document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

document.querySelector(DOMstrings.inputType).addEventListener('change',UICtrl.changedType);

    }
    var updateBudget=function()
    {
// 4. calculate the budget
budgetCtrl.calculateBudget();
// 5. return the budget
var budget=budgetCtrl.getBudget();

// 5. display the budget on UI
UICtrl.displayBudget(budget);
    };
    var updatePercentages=function()
    {
        //1 calculate percentage
        budgetCtrl.calculatePercentages();
        //2 read percentages from  budget controller
        var percentages=budgetCtrl.getPercentages();
        // 3 update the ui with new percentages
        UICtrl.displayPercentages(percentages);
    };
    var ctrlAddItem=function()
    { var input,newItem;
// 1. get the field input data
 input=UICtrl.getInput();
if(input.description!==""&& !isNaN(input.value) && input.value>0)
{
// 2. add the item to the budget controller
newItem= budgetCtrl.addItem(input.type,input.description,input.value);

// 3. add item to the UI
     UICtrl.addListItem(newItem,input.type);
// 4.clear the fields
UICtrl.clearFields();
  

//5 update and calculate
updateBudget();
// 6 calculate and update percentages
updatePercentages();
}

    }
    var ctrlDeleteItem=function(event)
    {   var itemId,splitId,type,ID;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId)
        {
          splitId=itemId.split('-');
          type=splitId[0];
          ID=parseInt(splitId[1]);
//1 delete from data structure
budgetCtrl.deleteItem(type,ID);
//2 delete from ui
UICtrl.deleteListItem(itemId);
//3 update budget
updateBudget();
// 4 calculate and update percentages
updatePercentages();
        }
    };
    return{
        init:function()
        {
            console.log('applicaton has started');
        UICtrl.displayDate();
            UICtrl.displayBudget( {
                budget:0,
                totalIncome:0,
                totalExpenses:0,
                percentage:0
            });
            setupEventListeners();
        }
    }

})(budgetController,UIController);
controller.init();