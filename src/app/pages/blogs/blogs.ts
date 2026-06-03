import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogDto } from '../../dtos/blog/blog.dto';
import {Pagination} from "../../components/pagination/pagination";

@Component({
  selector: 'app-blogs',
	imports: [CommonModule, FormsModule, RouterLink, Pagination],
  templateUrl: './blogs.html',
  styleUrls: ['./blogs.css']
})
export class Blogs implements OnInit {
  blogs: BlogDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  totalBlogs = 0;
  searchQuery = '';
  selectedTag = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.blogService.getPublished(this.currentPage, this.pageSize, this.selectedTag, this.searchQuery).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.blogs = response.data.blogs;
          this.totalBlogs = response.data.total;
          this.totalPages = response.data.pages;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadBlogs();
  }

  trackById(index: number, item: BlogDto): string {
    return item._id;
  }
}
