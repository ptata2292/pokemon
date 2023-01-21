import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private http: HttpClient,
  ) { }

  control: any[] = [];
  controlPokemon: any;
  pokemons: any;
  allPokemons: any[] = [];
  selectPokemons: any;
  mostrar: any;
  buscando: any;
  alertaPokemon: any;
  alfabetoPokemos: any[] = [];
  total: any;
  title = 'prueba';
  displayedColumns: string[] = ['nombre','ver'];
  displayedColumnsAlfabeto: string[] = ['id','letra','cantidad'];
  dataSource: any;
  dataSourceAlfabeto: any;

  @ViewChild('pokemonPaginator') paginator:any =  MatPaginator;
  @ViewChild('alfabetoPaginator') paginatorAlfabeto:any =  MatPaginator;
  @ViewChild('aForm') aForm:any = ElementRef;
    
  
  ngOnInit() {
    this.alfabetoPokemos = [
      {id: 1, letra: 'a', cantidad: null},
      {id: 2, letra: 'b', cantidad: null},
      {id: 3, letra: 'c', cantidad: null},
      {id: 4, letra: 'd', cantidad: null},
      {id: 5, letra: 'e', cantidad: null},
      {id: 6, letra: 'f', cantidad: null},
      {id: 7, letra: 'g', cantidad: null},
      {id: 8, letra: 'h', cantidad: null},
      {id: 9, letra: 'i', cantidad: null},
      {id: 10, letra: 'j', cantidad: null},
      {id: 11, letra: 'k', cantidad: null},
      {id: 12, letra: 'l', cantidad: null},
      {id: 13, letra: 'm', cantidad: null},
      {id: 14, letra: 'n', cantidad: null},
      {id: 15, letra: 'o', cantidad: null},
      {id: 16, letra: 'p', cantidad: null},
      {id: 17, letra: 'q', cantidad: null},
      {id: 18, letra: 'r', cantidad: null},
      {id: 19, letra: 's', cantidad: null},
      {id: 20, letra: 't', cantidad: null},
      {id: 21, letra: 'u', cantidad: null},
      {id: 22, letra: 'v', cantidad: null},
      {id: 23, letra: 'w', cantidad: null},
      {id: 24, letra: 'x', cantidad: null},
      {id: 25, letra: 'y', cantidad: null},
      {id: 26, letra: 'z', cantidad: null}
    ];
    this.controlPokemon = new FormControl();
    this.mostrar = false
    this.alertaPokemon = false
    this.buscando = false
    this.getPokemon()
  }

  getPokemon() {
    this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=10`)
        .subscribe(response => {
          this.pokemons = response
          this.total = this.pokemons.count
          this.dataSource = new MatTableDataSource<any>(this.pokemons.results);
          this.getAllPokemon()
        },
        error => {
          this.alertaPokemon = true
        });
  }

  getSelectPokemon(data: any) {
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${data}`)
        .subscribe(response => {
          this.selectPokemons = response
          this.scroll('detalle')
          if (!this.selectPokemons.sprites.other.dream_world.front_default) {
            this.selectPokemons.sprites.other.dream_world.front_default = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.selectPokemons.id}.png`
          }
        },
        error => {
          this.alertaPokemon = true
        });
        this.mostrar = false
  }

  getPokemonPagination(valor: any) {
    this.http.get(valor)
        .subscribe(response => {
          this.pokemons = response
          this.dataSource = new MatTableDataSource<any>(this.pokemons.results);
        },
        error => {
          this.alertaPokemon = true
        });
  }

  getAllPokemon() {
    this.http.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${this.pokemons.count}`)
        .subscribe((response : any) => {
          this.allPokemons = response.results
          this.control = this.allPokemons

          
          this.alfabetoPokemos.forEach(element => {
            let letra = this.allPokemons.filter( x => x.name.charAt(0) === element.letra)
            element.cantidad = letra.length
          });

          this.dataSourceAlfabeto = new MatTableDataSource<any>(this.alfabetoPokemos);
          this.dataSourceAlfabeto.paginator = this.paginatorAlfabeto;
        },
        error => {
          this.alertaPokemon = true
        });
  }

  getServerData(event?:any) {
    if(event.previousPageIndex < event.pageIndex)
      this.getPokemonPagination(this.pokemons.next)
    else
      this.getPokemonPagination(this.pokemons.previous)
  }

  busqueda(){
    this.mostrar = !this.mostrar
  }

  alerta(){
    this.alertaPokemon = !this.alertaPokemon
  }

  filterControl(){
    const filterValue = this.controlPokemon.value.toLowerCase()
    this.control = this.allPokemons.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    this.buscando = true
    this.dataSource = new MatTableDataSource<any>(this.allPokemons);
    this.dataSource.paginator = this.paginator;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;

    if(filterValue === '')
    {
      this.buscando = false
      this.getPokemon()
    }
    else
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }

  scroll(id: any) {
    const element: any = document.getElementById(id);
    element.scrollIntoView();
  }
}