import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';
@Component({
    selector: 'app-dishdetail',
    templateUrl: './dishdetail.component.html',
    styleUrls: ['./dishdetail.component.scss'],
    host:{
        '[@flyInOut]': 'true',
        'style': 'display: block;'
      },
    animations: [
        visibility(),
        flyInOut(),
        expand()
    ]
})
export class DishdetailComponent implements OnInit {

    dish: Dish;
    errMess: string;
    dishIds: string[];
    prev: string;
    next: string;

    feedbackForm: FormGroup;
    feedback: Feedback;
    @ViewChild('fform') feedbackFormDirective;

    dishcopy: Dish;
    visibility = 'shown';
    formErrors = {
        'author': '',
        'comment': '',
    };

    validationMessages = {
        'author': {
            'required': 'Name is required',
            'minlength': 'Name must at least two characters long',
            'maxlength': 'Name cannot longer than 25 characters'
        },
        'comment': {
            'required': 'Comment is required',
            'minlength': 'Comment must at least 10 characters long',
            'maxlength': 'Comment cannot longer than 300 characters'
        }
    };

    constructor(private dishService: DishService,
        private route: ActivatedRoute,
        private location: Location, private fb: FormBuilder,
        @Inject('BaseURL') private BaseURL) {
        this.createForm();
    }

    ngOnInit() {
        this.dishService.getDishIds()
            .subscribe((dishIds) => this.dishIds = dishIds);
        this.route.params
            .pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
            .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPreNext(dish.id); this.visibility = 'shown'; },
            errmess => this.errMess = <any> errmess);
    }

    setPreNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    goBack(): void {
        this.location.back();
    }

    createForm() {
        this.feedbackForm = this.fb.group({
            author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
            comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
            rating: [5, [Validators.required]],
        });
        this.feedbackForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {
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

    onSubmit(dishId) {
        this.feedback = this.feedbackForm.value;
        console.log(this.feedback);
        let thisDish = this.dishService.getDish(dishId);
        
        thisDish.subscribe(
            data=>{
                this.addNewComment(this.feedback, this.dishcopy.comments);
                this.dishService.putDish(this.dishcopy).subscribe(
                    dish => {this.dish = dish; this.dishcopy = dish;}
                ), errmess => {
                    this.dish = null; 
                    this.dishcopy = null;
                    this.errMess = <any> errmess;
                }
            }
        );
        this.feedbackFormDirective.resetForm();
        this.feedbackForm.reset({
            name: '',
            comment: '',
            rating: 5,
        });

    }

    addNewComment(feedback, comments) {
        let newComment = new Comment();
        newComment.author = feedback.author;
        newComment.comment = feedback.comment;
        newComment.rating = feedback.rating;
        newComment.date = new Date().toString();
        comments.push(newComment);
    }
}
