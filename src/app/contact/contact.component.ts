import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  currentFeedback: Feedback;
  errMess: string;
  contactType = ContactType;
  submitted: boolean = false;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname':'',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must at least two characters long',
      'maxlength': 'First name cannot longer than 25 characters'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must at least two characters long',
      'maxlength': 'Last name cannot longer than 25 characters'
    },
    'telnum': {
      'required': 'Telephone number is required',
      'pattern': 'Telephone number only contains numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid format'
    },
  };
  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contactstype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?:any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key];
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.submitted = true;
    this.feedbackService.submitFeedback(this.feedback)
    .subscribe( fb => {this.feedback = fb; this.currentFeedback = fb; if (fb) {
      this.submitted = false;
    }}
    , errmess => {
        this.feedback = null; 
        this.errMess = <any> errmess;
    });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactstype: 'None',
      message: ''
    });

   
    this.feedbackFormDirective.resetForm();
  }
}
