// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded. 

const calorieEntriesUrl = "http://localhost:3000/api/v1/calorie_entries"
const newCalorieForm = document.getElementById("new-calorie-form")

document.addEventListener('DOMContentLoaded', () => {
  const caloriesListUl = document.getElementById('calories-list')
  caloriesListUl.innerHTML = ''
  
  fetch(calorieEntriesUrl)
  .then(resp => resp.json())
  .then(addCalorieEntriesToDom)

}); 

// following two functions create entry li and append to DOM

const addCalorieEntriesToDom = (calorieEntries) => {
  const caloriesListUl = document.getElementById('calories-list')
  calorieEntries.forEach(entry => {
    const calorieLi = createCalorieLi(entry)
    caloriesListUl.prepend(calorieLi)
  });
};

const createCalorieLi = (calorieEntry) => {
  const calorieLi = document.createElement('li')
  calorieLi.className = "calories-list-item"
  calorieLi.dataset.calorieEntryId = calorieEntry.id
  calorieLi.innerHTML = `
    <div class="uk-grid"> 
      <div class="uk-width-1-6"> 
        <strong>
          ${calorieEntry.calorie}
        </strong> 
        <span>kcal</span> 
      </div> 
      <div class="uk-width-4-5"> 
        <em class="uk-text-meta">
          ${calorieEntry.note}
        </em> 
      </div> 
    </div> 
    <div class="list-item-menu"> 
      <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil">
      </a> 
      <a class="delete-button" uk-icon="icon: trash">
      </a> 
    </div>
  `
  addToCalorieSum(calorieEntry.calorie)
  return calorieLi
};

document.addEventListener('submit', (e) => {
  e.preventDefault()

  const form = e.target
  const formData = {
    calorie: form[0].value,
    note: form[1].value
  }

  addEntryToServerAndDom(formData)
  form.reset()
});

const addEntryToServerAndDom = (entryData) => {
  const caloriesListUl = document.getElementById('calories-list')
  fetch(calorieEntriesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(entryData)
  })
  .then(resp => resp.json())
  .then(entry => {
    caloriesListUl.prepend(createCalorieLi(entry))
  })
};

const addToCalorieSum = (calories) => {
  let progressBar = document.querySelector('PROGRESS');
  progressBar.value += calories
};

document.addEventListener('click', (e) => {
  if (e.target.dataset.svg === "trash"){
    const calorieEntry = e.target.parentNode.parentNode.parentNode
    const entryId = calorieEntry.dataset.calorieEntryId
    deleteEntry(entryId)
    calorieEntry.remove()
  }
});

const deleteEntry = (id) => {
  fetch(`${calorieEntriesUrl}/${id}`, {
    method: "DELETE"
  })
};