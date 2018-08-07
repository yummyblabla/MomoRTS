import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { PasswordValidator } from './password.validator';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})

export class AccountPageComponent implements OnInit {
	@Output() changePage: EventEmitter<boolean> = new EventEmitter<boolean>();

	userInfoForm: FormGroup;
	passwordFormGroup: FormGroup;
	accountCreateForm: FormGroup;

	username: FormControl;
	password: FormControl;
	confirmPassword: FormControl;
	email: FormControl;

	private accountCreationListener;

	incorrectFormInput: boolean = false;
	accountCreateSuccess: boolean = false;
	accountCreateFail: boolean = false;

	constructor(private formBuilder: FormBuilder,
				private wsService: WebsocketService) { }

	ngOnInit() {
// Initializes the form controls and form for account creation information
		this.createFormControls();
		this.createForm();
// Initializes the subscriber to send and listen for server messages 
		this.accountCreationListenerInit();
	}

// Initiates the FormControls
	createFormControls() {
		this.username = new FormControl('', { validators:
			[Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)], 
			updateOn: 'blur' });
		this.email = new FormControl('', { validators: [Validators.required, Validators.email],
			updateOn: 'blur' });
		this.password = new FormControl('', { validators: 
			[Validators.required, Validators.minLength(8)],
			updateOn: 'blur' });
		this.confirmPassword = new FormControl('', { validators: 
			[Validators.required],
			updateOn: 'blur' });
		
	}

// Appends the FormControls to the FormGroup
	createForm() {
		this.passwordFormGroup = new FormGroup({
			'password': this.password,
			'confirmPassword': this.confirmPassword,
		}, (formGroup: FormGroup) => {
			return PasswordValidator.areEqual(formGroup);
		});
		this.userInfoForm = new FormGroup({
			'username': this.username,
			'email': this.email
		});
		this.accountCreateForm = this.formBuilder.group({
			'userInfoForm': this.userInfoForm,
			'passwordFormGroup': this.passwordFormGroup
		});
	
	}

// Sends server to initiate account creation
	onCreate() {
		if (this.accountCreateForm.valid) {
			this.incorrectFormInput = false;
			this.wsService.subject.next({
				type: "begin-create-account"
			})
		} else {
			this.incorrectFormInput = true;
		}
	}

// Subscribe to Websocket Subject to listen for message to send Server more data
	accountCreationListenerInit() {
		let accountCreationListener = this.wsService.subject.subscribe(data => {
			if (data["type"] == "new-account-salt") {
				console.log(data);
				this.wsService.subject.next({
					type: "create-account",
					username: this.username.value,
					storedPW: this.wsService.hash(this.password.value + data["salt"]),
					email: this.email.value
				});
			} else if (data["type"] == "activation-email-sent") {
				this.accountCreateSuccess = true;
				this.accountCreateFail = false;
			} else if (data["type"] == "username-taken") {
				this.accountCreateFail = true;
				this.accountCreateSuccess = false;
			}
		});
	}

// Emits boolean to change showLogin in MainComponent to go to the Login page
	goToLogin() {
		this.changePage.emit(true);
	}

// Unsubscribes from websocket when component is destroyed
	ngOnDestroy() {
		this.accountCreationListener.unsubscribe();
	}
}
