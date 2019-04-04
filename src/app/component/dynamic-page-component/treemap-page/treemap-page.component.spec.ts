import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreemapPageComponent } from './treemap-page.component';

describe('TreemapPageComponent', () => {
  let component: TreemapPageComponent;
  let fixture: ComponentFixture<TreemapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreemapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreemapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
