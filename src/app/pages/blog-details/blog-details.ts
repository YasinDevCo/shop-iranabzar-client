import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogDto } from '../../dtos/blog/blog.dto';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-details.html',
  styleUrls: ['./blog-details.css']
})
export class BlogDetails implements OnInit {
  blog: BlogDto | null = null;
  loading = false;
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['slug'];
    this.loadBlog();
  }

  loadBlog(): void {
    this.loading = true;
    this.blogService.getBySlug(this.slug).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.blog = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.loading = false;
      }
    });
  }
}
