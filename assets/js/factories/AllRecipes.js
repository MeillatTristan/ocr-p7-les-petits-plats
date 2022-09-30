import { recipes } from '../data/recipes.js'

export default class AllRecipes {
  constructor() {
    this.data = recipes;
    this.dataActive = [];
    this.filters = {};
    this.filters.ingredients = [];
    this.filters.appareils = [];
    this.filters.ustentiles = [];

    this.filtersActive = { ...this.filters };

    this.tagsActive = [];
    this.tagsActive.ingredients = [];
    this.tagsActive.appareils = [];
    this.tagsActive.ustentiles = [];
    this.test = [];
    this.test.push("a")

    this.initEvent()
    this.displayData(this.data)
    this.listFilters(this.data)
    this.addFilters(this.filters)

  }

  initEvent() {
    const filters = document.getElementsByClassName('search__containerFilter__filter')
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('click', () => {
        this.displayFilters(filters[i])
        document.addEventListener('click', (e) => {
          const isClickInside = filters[i].contains(e.target);
          if (!isClickInside) {
            this.closeFilters(filters[i]);
          }
        })
      })
    }

    const inputFilters = document.getElementsByClassName('inputFiltre');
    for (let i = 0; i < inputFilters.length; i++) {
      inputFilters[i].addEventListener('input', (e) => {
        this.searchFilter(e);
      });

    }

    const searchbar = document.getElementById('search-bar');
    searchbar.addEventListener('input', (e) => {
      this.searchBar(e);
    })
  }

  displayFilters(filter) {
    filter.classList.add('active')
  }

  closeFilters(filter) {
    filter.classList.remove('active')
  }

  displayData(data) {
    const containerRecipes = document.getElementById('containerRecipes')
    containerRecipes.innerHTML = '';
    if (data.length <= 0) {
      containerRecipes.innerHTML = '<p class="error"> Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc';
    }
    for (let i = 0; i < data.length; i++) {
      const recipe = data[i];
      const card = document.createElement('div')
      card.classList.add('recettes__card')

      const illu = document.createElement('div')
      illu.classList.add('recettes__card__illu')

      const text = document.createElement('div')
      text.classList.add('recettes__card__text')

      const top = document.createElement('div')
      top.classList.add('recettes__card__text__top')

      const title = document.createElement('h2')
      title.textContent = recipe.name

      const time = document.createElement('span')
      time.innerHTML = `<i class="fa-regular fa-clock"></i> ${recipe.time}mn`

      top.appendChild(title)
      top.appendChild(time)

      text.appendChild(top)

      const bottom = document.createElement('div')
      bottom.classList.add('recettes__card__text__bottom')

      const listIngredient = document.createElement('ul')

      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j];
        const liIngredient = document.createElement('li')
        let stringIngrdient = "";
        if (ingredient.quantity) {
          stringIngrdient = `<strong>${ingredient.ingredient}:</strong> ${ingredient.quantity}`;

          if (ingredient.unit) {
            stringIngrdient = `<strong>${ingredient.ingredient}:</strong> ${ingredient.quantity}${ingredient.unit}`
          }
        } else {
          stringIngrdient = `<strong>${ingredient.ingredient}</strong>`
        }
        liIngredient.innerHTML = stringIngrdient;
        listIngredient.appendChild(liIngredient)
      }

      const description = document.createElement('p')
      description.textContent = this.truncateText(recipe.description, 175)

      bottom.appendChild(listIngredient)
      bottom.appendChild(description)

      text.appendChild(bottom)

      card.appendChild(illu)
      card.appendChild(text)

      containerRecipes.appendChild(card)
    }
  }

  truncateText(text, length) {
    if (text.length <= length) {
      return text
    }

    return text.substr(0, length) + '\u2026'
  }

  listFilters(data) {
    this.filters.ingredients = [];
    this.filters.appareils = [];
    this.filters.ustentiles = [];

    for (let i = 0; i < data.length; i++) {
      const recipe = data[i];

      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j];
        if (!this.filters.ingredients.includes(ingredient.ingredient.toLowerCase().replace(/\./g, ''))) {
          this.filters.ingredients.push(ingredient.ingredient.toLowerCase().replace(/\./g, ''))
        }
      }

      if (!this.filters.appareils.includes(recipe.appliance.replace(/\./g, '').toLowerCase())) {
        this.filters.appareils.push(recipe.appliance.replace(/\./g, '').toLowerCase())
      }

      for (let j = 0; j < recipe.ustensils.length; j++) {
        const ustentil = recipe.ustensils[j];
        if (!this.filters.ustentiles.includes(ustentil.toLowerCase().replace(/\./g, '').toLowerCase())) {
          this.filters.ustentiles.push(ustentil.toLowerCase().replace(/\./g, '').toLowerCase())
        }
      }
    }
  }

  addFilters(data) {
    const ingredientList = document.getElementById('ingredientsList');
    ingredientList.innerHTML = "";

    for (let i = 0; i < data.ingredients.length; i++) {
      const ingredient = data.ingredients[i];
      let li = document.createElement('li')
      li.textContent = this.truncateText(ingredient, 16)
      li.addEventListener('click', (e) => {
        if (!this.tagsActive.ingredients.find(element => element == e.target.textContent)) {
          this.addTags(e, 'ingredients');
        }
      })

      ingredientList.appendChild(li)
    }

    const appareilList = document.getElementById('appareilsList');
    appareilList.innerHTML = "";

    for (let i = 0; i < data.appareils.length; i++) {
      const appareil = data.appareils[i];
      let li = document.createElement('li')
      li.textContent = this.truncateText(appareil, 16)

      li.addEventListener('click', (e) => {
        if (!this.tagsActive.appareils.find(element => element == e.target.textContent)) {
          this.addTags(e, 'appareils');
        }
      })

      appareilList.appendChild(li)
    }
    const ustentileList = document.getElementById('ustentilesList');
    ustentileList.innerHTML = "";

    for (let i = 0; i < data.ustentiles.length; i++) {
      const ustentile = data.ustentiles[i];
      let li = document.createElement('li')
      li.textContent = this.truncateText(ustentile, 16)

      li.addEventListener('click', (e) => {
        if (!this.tagsActive.ustentiles.find(element => element == e.target.textContent)) {
          this.addTags(e, 'ustentiles');
        }
      })

      ustentileList.appendChild(li)
    }
  }

  addTags(e, type) {
    this.tagsActive[type].push(e.target.textContent);
    const returnArray = this.searchTags();
    this.displayData(returnArray)

    const containerTags = document.getElementById('containerTags');

    let tag = document.createElement('div');
    tag.classList.add('search__containerTags__tag', type);

    let text = document.createElement('p');
    text.textContent = e.target.textContent;
    tag.appendChild(text);
    tag.addEventListener('click', (e) => {
      tag.remove();
      var index = this.tagsActive[type].indexOf(e.target.textContent);
      if (index !== -1) {
        this.tagsActive[type].splice(index, 1);
        this.displayData(this.searchTags())
      }
    })

    containerTags.appendChild(tag);
  }

  /**
   * 
   * @param {Event} e 
   */
  searchBar(e) {
    const searchValue = e.target.value;
    if (searchValue.length >= 3) {
      const dataReturn = this.searchArray(searchValue);
      this.listFilters(dataReturn);
      this.addFilters(this.filters);
      this.displayData(dataReturn);
    } else if (this.tagsActive.ingredients.length  +  this.tagsActive.ustentiles.length + this.tagsActive.appareils.length > 0){
      this.displayData(this.searchTags());
    } else {
      this.listFilters(this.data);
      this.addFilters(this.filters);
      this.displayData(this.data);
    }
  }

  /**
   * 
   * @param {Event} e 
   */
  searchFilter(e) {
    const searchValue = e.target.value;

    if (searchValue.length >= 3) {
      if (e.target.id == 'inputIngredient') {
        this.filtersActive.ingredients = this.searchFilterScript(this.filters.ingredients, searchValue);
        this.addFilters(this.filtersActive);
      }
      else if (e.target.id == 'inputAppareil') {
        this.filtersActive.appareils = this.searchFilterScript(this.filters.appareils, searchValue);
        this.addFilters(this.filtersActive);
      }
      else if (e.target.id == 'inputUstentile') {
        this.filtersActive.ustentiles = this.searchFilterScript(this.filters.ustentiles, searchValue);
        this.addFilters(this.filtersActive);
      }
    } else {
      this.addFilters(this.filters);
    }
  }

  searchFilterScript(array, searchString) {
    searchString = searchString.toLowerCase().replace(/\./g, '');
    let dataActive = [];
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.toLowerCase().replace(/\./g, '').includes(searchString)) {
        if (!dataActive.includes(element)) {
          dataActive.push(element);
        }
      }
    }

    return dataActive;
  }

  searchTags() {
    let checkArray;
    let counterIngredient
    let counterUstentile
    let counterAppareil
    let checkIngredient
    let checkUstentile
    let checkAppareil
    
    if (this.dataActive.length === 0 ) {
      checkArray = this.data;
    } else if (this.tagsActive.ingredients.length + this.tagsActive.ustentiles.length + this.tagsActive.appareils.length === 0 && document.getElementById('search-bar').value.length < 3 ){
      this.dataActive = [];
      this.listFilters(this.data);
      this.addFilters(this.filters);
      return this.data;
    } else if (this.tagsActive.ingredients.length  +  this.tagsActive.ustentiles.length + this.tagsActive.appareils.length === 0 && document.getElementById('search-bar').value.length >= 3){
      this.dataActive = [];
      let array = this.searchArray(document.getElementById('search-bar').value);
      this.listFilters(array);
      this.addFilters(this.filters);
      return array;
    } else if (this.tagsActive.ingredients.length  +  this.tagsActive.ustentiles.length + this.tagsActive.appareils.length != 0 && document.getElementById('search-bar').value.length < 3){
      this.dataActive = [];
      checkArray = this.data;
    } else { // if tags not empty and searchbar > 3 
      this.dataActive = [];
      checkArray = this.searchArray(document.getElementById('search-bar').value);
      this.dataActive = [];
    }
    console.log(checkArray)
    for (let i = 0; i < checkArray.length; i++) {
      const element = checkArray[i];
      checkIngredient = 0
      counterIngredient = 0;

      for (let j = 0; j < element.ingredients.length; j++) {
        const ingredient = element.ingredients[j];

        for (let k = 0; k < this.tagsActive.ingredients.length; k++) {
          const tag = this.tagsActive.ingredients[k];
          if (ingredient.ingredient.toLowerCase().replace(/\./g, '').includes(tag.replace('…', ''))) {
            counterIngredient += 1;
          }
        }
      }
      if(this.tagsActive.ingredients.length === counterIngredient){ 
        checkIngredient = 1
      }

      checkUstentile = 0
      counterUstentile = 0

      for (let j = 0; j < element.ustensils.length; j++) {
        const ustensil = element.ustensils[j];
        for (let k = 0; k < this.tagsActive.ustentiles.length; k++) {
          const tag = this.tagsActive.ustentiles[k];
          if (ustensil.toLowerCase().replace(/\./g, '').includes(tag)) {
            counterUstentile += 1;
          }
        }
      }

      if(this.tagsActive.ustentiles.length === counterUstentile){ 
        checkUstentile = 1
      }

      checkAppareil = 0
      counterAppareil = 0

      for (let k = 0; k < this.tagsActive.appareils.length; k++) {
        const tag = this.tagsActive.appareils[k];
        if (element.appliance.toLowerCase().replace(/\./g, '').includes(tag)) {
          counterAppareil += 1;
        }
      }

      if(this.tagsActive.appareils.length === counterAppareil){ 
        checkAppareil = 1
      }

      if( checkAppareil === 1 && checkIngredient === 1 && checkUstentile === 1){
        if (!this.dataActive.includes(element)){
          this.dataActive.push(element);
        }
      }
    }

    this.listFilters(this.dataActive);
    this.addFilters(this.filters);
    return (this.dataActive);
  }

  searchArray(searchString) {
    let checkArray;
    if (this.tagsActive.ingredients.length  +  this.tagsActive.ustentiles.length + this.tagsActive.appareils.length <= 0) {
      checkArray = this.data;
    } else {
      checkArray = this.dataActive;
      this.dataActive = [];
    }
    searchString = searchString.toLowerCase().replace(/\./g, '');

    for (let i = 0; i < checkArray.length; i++) {
      const element = checkArray[i];

      for (let j = 0; j < element.ingredients.length; j++) {
        const ingredient = element.ingredients[j];
        if (ingredient.ingredient.toLowerCase().replace(/\./g, '').includes(searchString)) {
          if (!this.dataActive.includes(element)) {
            this.dataActive.push(element);
          }
        }
      }

      for (let j = 0; j < element.ustensils.length; j++) {
        const ustensil = element.ustensils[j];
        if (ustensil.toLowerCase().replace(/\./g, '').includes(searchString)) {
          if (!this.dataActive.includes(element)) {
            this.dataActive.push(element);
          }
        }
      }

      if (element.name.toLowerCase().replace(/\./g, '').includes(searchString)) {
        if (!this.dataActive.includes(element)) {
          this.dataActive.push(element);
        }
      }

      if (element.description.toLowerCase().replace(/\./g, '').includes(searchString)) {
        if (!this.dataActive.includes(element)) {
          this.dataActive.push(element);
        }
      }

      if (element.appliance.toLowerCase().replace(/\./g, '').includes(searchString)) {
        if (!this.dataActive.includes(element)) {
          this.dataActive.push(element);
        }
      }
    }

    return (this.dataActive);

  }
}
