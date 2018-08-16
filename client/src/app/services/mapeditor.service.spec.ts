import { TestBed, inject } from '@angular/core/testing';

import { MapeditorService } from './mapeditor.service';

describe('MapeditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapeditorService]
    });
  });

  it('should be created', inject([MapeditorService], (service: MapeditorService) => {
    expect(service).toBeTruthy();
  }));
});
