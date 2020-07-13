import { Component, OnInit } from '@angular/core';
import { DateService } from './../shared/date.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService, Task } from '../shared/task.service';
import { switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-organaizer',
    templateUrl: './organaizer.component.html',
    styleUrls: ['./organaizer.component.scss']
})
export class OrganaizerComponent implements OnInit {
    form: FormGroup
    tasks: Task[] = []
    constructor(public dateService: DateService,
        private tasksService: TaskService) { }

    ngOnInit(): void {
        this.dateService.date.pipe(
            switchMap(value => this.tasksService.load(value))
        ).subscribe(tasks => {
            this.tasks = tasks
        })
        this.form = new FormGroup({
            title: new FormControl('', Validators.required)
        })
    }
    submit() {
        const { title } = this.form.value
        const task: Task = {
            title,
            date: this.dateService.date.value.format('DD-MM-YYYY')
        }
        this.tasksService.create(task).subscribe(task => {
            this.tasks.push(task)
            this.form.reset()
        }, err => console.log(err))
    }
    remove(task: Task) {
        this.tasksService.remove(task).subscribe(() => {
            this.tasks = this.tasks.filter(t => t.id !== task.id)
        }, err => console.log(err)
        )
    }
}
