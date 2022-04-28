import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';

import { Usuario } from 'src/app/demos/reactiveForms/cadastro/models/usuario';
import { NgBrazilValidators } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { CustomValidators } from 'ng2-validation';
import { DisplayMessage, GenericValidator, ValidationMessages } from './generic-form-validation';
import { fromEvent, merge, Observable } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})

export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
  cadastroForm: FormGroup;
  usuario: Usuario;
  formResult: string = '';
  MASKS = utilsBr.MASKS;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { 
    
    this.validationMessages = {
      nome: { 
        required: 'O Nome é requerido',
        minLength: 'O nome precisa ter no mínimo 2 caracteres',
        maxLength: 'O nome precisa ter no maximo 150 caracteres'
      }, 
      cpf: {
        required: 'Informe o CPF',
        cpf: 'CPF Inválido'
      }
      // email: {
      //   required: 'Informe o e-mail',
      //   email: 'Email Inválido'
      // }
      // senha: {
      //   required: 'Informe a senha',
      //   rangeLength: 'A senha deve possuir entre 6 e 15 carracteres'
      // }
      // senhaConfirmacao: {
      //   rangeLength: 'A senha deve possuir entre 6 e 15 carracteres',
      //   equalTo: 'As senhas não conferem'
      // }

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15])]);
    let senhaConfirmacao = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15]), CustomValidators.equalTo(senha)]);


    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
      email: ['',[Validators.required, Validators.email]],
      senha: senha,
      senhaConfirmacao: senhaConfirmacao,
    });
  }

  
  adicionarUsuario() {
    if(this.cadastroForm.dirty && this.cadastroForm.valid){
    this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
    this.formResult = JSON.stringify(this.cadastroForm.value);
    }
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(FormControl.nativeElement, 'blur' ));
    this.cdRef.detectChanges();

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
    });
  }
}
