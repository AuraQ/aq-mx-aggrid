## General
- [ ] Widget section in grid header
## Column configuration
- [X] Can Sort (property to control whether a column is sortable or not) 
    - [X] Add 'Can Sort' property to column configuration
    - [X] Disable 'Can Sort' property for custom content
    - [X] Set sort configuration on ColumnDefinition
- [X] Can Resize (property to control whether a column is resizable or not) 
    - [X] Add 'Can Resize' property to column configuration
    - [X] Set resize configuration on ColumnDefinition
- [X] Can Reorder (property to control whether a column is movable or not) 
    - [X] Refactor existing 'suppress move' so it is consistent with DG2
- [ ] Can Hide
    - [ ] Yes  
    - [ ] Yes, hidden by default (https://www.ag-grid.com/react-data-grid/column-properties/#reference-display-hide)
    - [ ] No (https://www.ag-grid.com/react-data-grid/column-properties/#reference-columns-suppressColumnsToolPanel)
- [ ] Column Sizing (property/ies to control width of a column) 
    - [X] Width
    - [ ] Auto fit to grid width (NEEDS INVESTIGATION - WHEN GRID INITIALISES IT IS 0 WIDTH, PRESUMABLY DUE TO MENDIX'S DYNAMIC LOADING)
- [ ] Column content appearance (property/ies to control how data is shown in a cell) 
    - [ ] Text alignment
    - [ ] Dynamic cell class
    - [ ] Wrap text
## General Configuration
- [ ] Refresh time (property to control how often to refresh grid content)
- [X] Selection (property to control what row/s are selectable in the grid)
    - [X] Selection method: None
    - [X] Selection method: Single
    - [X] Selection method: Multi
    - [X] un/check all    
- [ ] Page size (number of rows to show)
- [ ] Pagination
    - [ ] Buttons vs virtual scroll
    - [ ] Button position
- [ ] Empty list message
- [ ] Dynamic row class (refactor so is in a place consistent with DG2)
- [ ] Events
    - [ ] On click
    - [X] On selection change
## Grid wide config
- [ ] Default column capabilities
    - [X] Sorting
    - [X] Resizing
    - [X] Reordering
    - [ ] Hiding
## Personalization
- [ ] Configuration
    - [ ] Attribute
    - [ ] On Change
## Grid wide filtering
- [ ] Filters
## Accessibility
- [ ] Filter Section Title
## Theming
- [ ] Migrate from legacy AG Grid themes (https://www.ag-grid.com/react-data-grid/theming-migration/)


