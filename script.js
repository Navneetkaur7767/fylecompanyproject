let currentPage = 1;
        let repositoriesPerPage = 10;
        let totalRepositories = 0;
        let isLoading = false;
        const accessToken = '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';  // Replace with your actual access token

        function fetchRepositories() {
            const username = document.getElementById('username').value;
            const perPage = document.getElementById('perPage').value;
            const searchQuery = document.getElementById('search').value;

            // Update state
            currentPage = 1;
            repositoriesPerPage = perPage;

            // Show loader
            showLoader();

            // Fetch repositories from GitHub API with pagination and search
            const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}&q=${searchQuery}`;

            fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    // Update total repositories count for pagination
                    totalRepositories = data.total_count;

                    // Display repositories
                    displayRepositories(data.items);

                    // Hide loader
                    hideLoader();
                })
                .catch(error => {
                    console.error('Error fetching repositories:', error);
                    document.getElementById('repositories').innerHTML = 'Error fetching repositories. Please try again.';
                    hideLoader();
                });
        }

        function displayRepositories(repositories) {
            const repositoriesContainer = document.getElementById('repositories');

            if (repositories.length === 0) {
                repositoriesContainer.innerHTML = 'No repositories found.';
                return;
            }

            const list = document.createElement('ul');
            repositories.forEach(repo => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${repo.name}</h5>
                            <p class="card-text">${repo.description || 'No description available.'}</p>
                            <p class="card-text">Language: ${repo.language || 'Not specified'}</p>
                            <p class="card-text">Stars: ${repo.stargazers_count}</p>
                            <p class="card-text">Forks: ${repo.forks_count}</p>
                        </div>
                    </div>
                `;
                list.appendChild(listItem);
            });

            repositoriesContainer.innerHTML = '';
            repositoriesContainer.appendChild(list);

            // Display pagination controls
            displayPagination();
        }

        function displayPagination() {
            const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);
            const paginationContainer = document.getElementById('pagination');

            if (totalPages > 1) {
                paginationContainer.innerHTML = `
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="changePage(-1)">Previous</a>
                            </li>
                            <li class="page-item disabled">
                                <span class="page-link">Page ${currentPage} of ${totalPages}</span>
                            </li>
                            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="changePage(1)">Next</a>
                            </li>
                        </ul>
                    </nav>
                `;
            } else {
                paginationContainer.innerHTML = '';
            }
        }

        function changePage(offset) {
            currentPage += offset;
            fetchRepositories();
        }

        function showLoader() {
            isLoading = true;
            document.getElementById('loader').style.display = 'block';
        }

        function hideLoader() {
            isLoading = false;
            document.getElementById('loader').style.display = 'none';
        }

        // Initial fetch when the page loads
        fetchRepositories();