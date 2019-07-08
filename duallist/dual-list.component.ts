
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, ViewChild, ElementRef, Injectable } from '@angular/core';
import { MessageService } from 'app/shared/components/messages/message.service';
import { error } from 'util';
import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { ItemDualList } from 'app/shared/models/Item-dual-Lista';
import { ElementDef } from '@angular/core/src/view';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { element } from 'protractor';

@Component({
	selector: 'app-dual-list',
	templateUrl: './dual-list.html',
	styleUrls: ['./dual-list.scss']
})

export class DualListComponent implements OnInit, OnDestroy {
	@ViewChild('filtroItem') filtroItem: ElementRef;
	@ViewChild('filtroTarget') filtroTarget: ElementRef;
	@Input() source: ItemDualList[] = [];
	@Input() target: ItemDualList[] = [];
	@Input() compName;
	@Input() disabled ;
	leftName = 'left';
	rightName = 'right';
	listgroupitemprimary = 'selected';
	listgroupitemsecondary = 'list-group-item-secondary';
	filtro_item = '';
	filtro_target = '';
	priClick = null;
	dragClick = 0;
	filtro_itens = ''

	constructor(
		protected messageService: MessageService,
		private dragulaService: DragulaService,
		private route: ActivatedRoute) {
		const that = this;
		console.log('constructor');
		console.log('compName ' + this.compName);
		dragulaService.drop.subscribe((value) => {
			console.log(`drop: ${value[0]}`);
			this.onDrop(value.slice(1));
		});

		dragulaService.drag.subscribe((value) => {
			this.onDrag();
		});
	}

	ngOnInit() {
		console.log('habilitado : ' + this.disabled);
		this.target.forEach(elemento => {
			console.log(elemento.name);
			 const selecionado = this.source.find(myObj => (myObj.name === elemento.name ));
			 	if (selecionado !== null || selecionado !== undefined) {
					 this.source.splice(this.source.indexOf(selecionado), 1);
					 console.log(this.source);
			 	}
		});
		this.dragulaService.setOptions(this.compName, {
			accepts: (el, target, source, sibling) => {
				if (source.id !== target.id) {
					if (source.id === this.leftName && this.filtroItem.nativeElement.value.length > 0) {
						this.messageService.addMsgWarning('Conteúdo filtrado, utilize os botões de controle para mover os itens desejados');
						return false;
					} else if (source.id === this.rightName && this.filtroTarget.nativeElement.value.length > 0) {
						this.messageService.addMsgWarning('Conteúdo filtrado, utilize os botões de controle para mover os itens desejados');
						return false;
					}
					return true;
				} else {
					return false;
				}
			},
			moves:  (el, container, handle) => {
				console.log(this.disabled)
				if (this.disabled) {
					return false;
				} else {
					return true;
				}
			}
		});
	}

	transform(items: any[], filter: ItemDualList): any {
		if (!items || !filter) {
			return items;
		}
		return items.filter(item => item.name.indexOf(filter.name) !== -1);
	}

	selectRowSource(item: ItemDualList, event) {
		if (this.disabled) {
			return
		}
		this.priClick == null && !item.selected ? this.priClick = this.source.indexOf(item) : this.priClick = this.priClick;
		if (event.shiftKey) {
			console.log('shift_clicado');
			if (this.priClick !== this.source.indexOf(item)) {
				let inicio;
				let fim;
				if (this.priClick < this.source.indexOf(item)) {
					fim = this.source.indexOf(item);
					inicio = this.priClick;
				} else {
					fim = this.priClick;
					inicio = this.source.indexOf(item);
				}
				for (let i = inicio; i <= fim; i++) {
					this.source[i].selected = true;
				}
				this.priClick = null;
			}
		} else {
			item.selected ? item.selected = false : item.selected = true;
		}
	}

	selectRowTarget(item: ItemDualList, event) {
		if (this.disabled) {
			return
		}
		this.priClick == null && !item.selected ? this.priClick = this.target.indexOf(item) : this.priClick = this.priClick;
		if (event.shiftKey) {
			if (this.priClick !== this.target.indexOf(item)) {
				let inicio;
				let fim;
				if (this.priClick < this.target.indexOf(item)) {
					fim = this.target.indexOf(item);
					inicio = this.priClick;
				} else {
					fim = this.priClick;
					inicio = this.target.indexOf(item);
				}
				for (let i = inicio; i <= fim; i++) {
					this.target[i].selected = true;
				}
				this.priClick = null;
			}
		} else {
			item.selected ? item.selected = false : item.selected = true;
		}
	}

	moverTodosEsqDir() {
		console.log('moverTodosEsqDir');
		let index: number = this.source.length - 1;
		if (this.filtroItem.nativeElement.value === null || this.filtroItem.nativeElement.value === '') {
			while (index >= 0) {
				this.source[index].selected = false;
				this.target.push(this.source[index]);
				this.source.splice(index, 1);
				index -= 1;
				this.target = this.target.sort((n1, n2) => {
					return this.naturalCompare(n1.name, n2.name)
				});
			}
		} else {
			while (index >= 0) {
				if (this.source[index].name.toUpperCase().indexOf(this.filtroItem.nativeElement.value.toUpperCase()) >= 0) {
					this.source[index].selected = false;
					this.target.push(this.source[index]);
					this.source.splice(index, 1);
					this.target = this.target.sort((n1, n2) => {
						return this.naturalCompare(n1.name, n2.name)
					});
				}
				index -= 1;
			}
		}
	}

	moverEsqDir() {
		this.target.slice(0);
		let index: number = this.source.length - 1;
		if (this.filtro_target !== '') {
			this.filtro_target = '';
		}
		while (index >= 0) {
			if (this.source[index].selected) {
				this.source[index].selected = false;
				this.target.push(this.source[index]);
				this.source.splice(index, 1);
			}
			index -= 1;
			// this.target = this.target.sort((n1, n2) => {
			// 	return this.naturalCompare(n1.name, n2.name)
			// });
		}
		this.target = this.target.sort((n1, n2) => {
			return this.naturalCompare(n1.name, n2.name)
		});
	}

	moverDirEsq() {
		if (this.filtro_itens !== '') {
			this.filtro_itens = '';
		}
		let index: number = this.target.length - 1;
		while (index >= 0) {
			if (this.target[index].selected) {
				this.target[index].selected = false;
				this.source.push(this.target[index]);
				this.target.splice(index, 1);
			}
			index -= 1;
			this.source = this.source.sort((n1, n2) => {
				return this.naturalCompare(n1.name, n2.name)
			});
		}
		this.source = this.source.sort((n1, n2) => {
			return this.naturalCompare(n1.name, n2.name)
		});
	}

	moverTodosDirEsq() {
		console.log('moverTodosDirEsq');
		let index: number = this.target.length - 1;
		if (this.filtroTarget.nativeElement.value === null || this.filtroTarget.nativeElement.value === '') {
			while (index >= 0) {
				this.target[index].selected = false;
				this.source.push(this.target[index]);
				this.target.splice(index, 1);
				index -= 1;
				this.source = this.source.sort((n1, n2) => {
					return this.naturalCompare(n1.name, n2.name)
				});
			}
		} else {
			while (index >= 0) {
				if (this.target[index].name.toUpperCase().indexOf(this.filtroTarget.nativeElement.value.toUpperCase()) >= 0) {
					this.target[index].selected = false;
					this.source.push(this.target[index]);
					this.target.splice(index, 1);
					this.source = this.source.sort((n1, n2) => {
						return this.naturalCompare(n1.name, n2.name)
					});
				}
				index -= 1;
			}
		}
	}

	naturalCompare(a, b) {
		const ax = [], bx = [];
		a.replace(/(\w+.+)/g, function (_, $1, $2) {
			ax.push([$1 || Infinity, $2 || ''])
			console.log(ax);
		});
		b.replace(/(\w+.+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || '']) });
		while (ax.length && bx.length) {
			const an = ax.shift();
			const bn = bx.shift();
			const nn = (an[0] - bn[0]) || an[0].localeCompare(bn[0]);
			if (nn) {
				return nn;
			}
			return ax.length - bx.length;
		}
	}

	desmarcaTodosDir() {
		this.target.forEach(elemento => {
			elemento.selected = false;
		});
	}

	desmarcaTodosEsq() {
		this.source.forEach(elemento => {
			elemento.selected = false;
		});
	}

	private onDrop(args) {
		console.log('onDrop');
		setTimeout(() => {
			if (args[2].id === this.leftName) {
				this.moverEsqDir();
				this.desmarcaTodosDir();
			} else {
				this.moverDirEsq();
				this.desmarcaTodosEsq();
			}
		}, 100);
	}

	private onDrag() {
		console.log('Drag')
		if (this.disabled) {
			console.log(this.compName);
			return
		}
	}

	ngOnDestroy() {
		console.log('destroi');
		this.dragulaService.destroy(this.compName);
	}
}
